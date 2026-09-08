const fs = require("fs");
let code = fs.readFileSync("src/lib/bio.ts", "utf8");

const builderClassStr = `class ManualQueryBuilder<T extends Record<string, unknown>> {
  private tableName: "profiles" | "links" | "user_roles";
  private filters: QueryFilter[] = [];
  private orderConfig: OrderConfig | null = null;
  private limitCount: number | null = null;
  private isSingle = false;
  private isMaybeSingle = false;
  private operation: "select" | "update" | "delete" | "insert" = "select";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private payload: any = null;

  constructor(tableName: "profiles" | "links" | "user_roles") {
    this.tableName = tableName;
  }
  select(_columns?: string) {
    if (this.operation !== "insert" && this.operation !== "update") {
      this.operation = "select";
    }
    return this;
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  eq(column: string, value: any) {
    this.filters.push({ column, operator: "eq", value });
    return this;
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ilike(column: string, value: any) {
    this.filters.push({ column, operator: "ilike", value });
    return this;
  }
  order(column: string, config: { ascending?: boolean } = {}) {
    this.orderConfig = { column, ascending: config.ascending ?? true };
    return this;
  }
  limit(count: number) {
    this.limitCount = count;
    return this;
  }
  single() {
    this.isSingle = true;
    return this;
  }
  maybeSingle() {
    this.isMaybeSingle = true;
    return this;
  }
  update(changes: Partial<T>) {
    this.operation = "update";
    this.payload = changes;
    return this;
  }
  insert(values: Partial<T>) {
    this.operation = "insert";
    this.payload = values;
    return this;
  }
  delete() {
    this.operation = "delete";
    return this;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async execute(): Promise<{ data: any; error: Error | null }> {
    try {
      const { collection, doc, getDocs, getDoc, query, where, orderBy, limit, setDoc, updateDoc, deleteDoc } = await import("firebase/firestore");
      const { db } = await import("./firebase");

      let collectionRef = collection(db, this.tableName);

      if (this.operation === "select") {
        let q = query(collectionRef);
        
        for (const filter of this.filters) {
          if (filter.operator === "eq") {
            if (filter.column === "id") {
               // Fast path for ID lookup
               const dSnap = await getDoc(doc(db, this.tableName, filter.value));
               if (dSnap.exists()) {
                 const data = dSnap.data();
                 return { data: this.isSingle || this.isMaybeSingle ? data : [data], error: null };
               } else {
                 return { data: this.isSingle || this.isMaybeSingle ? null : [], error: null };
               }
            }
            q = query(q, where(filter.column, "==", filter.value));
          } else if (filter.operator === "ilike") {
             // Firestore does not natively support case-insensitive ilike. 
             // We can just use exact match or fallback for now.
             q = query(q, where(filter.column, "==", filter.value));
          }
        }
        
        if (this.orderConfig) {
          q = query(q, orderBy(this.orderConfig.column, this.orderConfig.ascending ? "asc" : "desc"));
        }
        if (this.limitCount) {
          q = query(q, limit(this.limitCount));
        }

        const snapshot = await getDocs(q);
        const results = snapshot.docs.map(d => d.data());
        
        if (this.isSingle || this.isMaybeSingle) {
          return { data: results.length > 0 ? results[0] : null, error: null };
        }
        return { data: results, error: null };
      }

      if (this.operation === "insert") {
         const id = this.payload.id || crypto.randomUUID();
         const data = { ...this.payload, id };
         await setDoc(doc(db, this.tableName, id), data);
         return { data, error: null };
      }

      if (this.operation === "update") {
         const idFilter = this.filters.find(f => f.column === "id");
         if (!idFilter) throw new Error("Update without ID filter is not supported yet.");
         await updateDoc(doc(db, this.tableName, idFilter.value), this.payload);
         return { data: null, error: null };
      }

      if (this.operation === "delete") {
         const idFilter = this.filters.find(f => f.column === "id");
         if (!idFilter) throw new Error("Delete without ID filter is not supported yet.");
         await deleteDoc(doc(db, this.tableName, idFilter.value));
         return { data: null, error: null };
      }

      return { data: null, error: new Error("Unsupported operation") };
    } catch (err: any) {
      return { data: null, error: err };
    }
  }
}`;

const regex =
  /class ManualQueryBuilder<T extends Record<string, unknown>> \{[\s\S]*?\n\s+async execute\(\): Promise<\{ data: any; error: Error \| null \}> \{[\s\S]*?^\}/m;

// Find the position of the execute method and replace everything inside it.
code = code.replace(
  /class ManualQueryBuilder<T extends Record<string, unknown>> \{[\s\S]*?(?=\nexport const db = \{)/m,
  builderClassStr + "\n",
);

fs.writeFileSync("src/lib/bio.ts", code);
