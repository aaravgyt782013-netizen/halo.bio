import { n as __exportAll } from "../_runtime.mjs";
import { s as registerVersion } from "./@firebase/app+[...].mjs";
import "./@firebase/firestore+[...].mjs";
import { r as signInWithPopup, t as GoogleAuthProvider } from "./firebase__auth.mjs";
import { a as StringFormat, c as connectStorageEmulator, d as getStorage, f as invalidArgument, h as uploadBytesResumable, i as StorageErrorCode, l as dataFromString, m as ref, n as Location, o as TaskState, p as invalidRootOperation, r as StorageError, s as UploadTask, t as FbsBlob, u as getDownloadURL } from "./firebase__storage.mjs";
//#region node_modules/firebase/app/dist/esm/index.esm.js
/**
* @license
* Copyright 2020 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
registerVersion("firebase", "12.18.0", "app");
//#endregion
//#region node_modules/firebase/auth/dist/esm/index.esm.js
var index_esm_exports$1 = /* @__PURE__ */ __exportAll({
	GoogleAuthProvider: () => GoogleAuthProvider,
	signInWithPopup: () => signInWithPopup
});
//#endregion
//#region node_modules/firebase/storage/dist/esm/index.esm.js
var index_esm_exports = /* @__PURE__ */ __exportAll({
	StorageError: () => StorageError,
	StorageErrorCode: () => StorageErrorCode,
	StringFormat: () => StringFormat,
	_FbsBlob: () => FbsBlob,
	_Location: () => Location,
	_TaskState: () => TaskState,
	_UploadTask: () => UploadTask,
	_dataFromString: () => dataFromString,
	_invalidArgument: () => invalidArgument,
	_invalidRootOperation: () => invalidRootOperation,
	connectStorageEmulator: () => connectStorageEmulator,
	getDownloadURL: () => getDownloadURL,
	getStorage: () => getStorage,
	ref: () => ref,
	uploadBytesResumable: () => uploadBytesResumable
});
//#endregion
export { index_esm_exports$1 as n, index_esm_exports as t };
