export var BorderType;
(function (BorderType) {
    BorderType["All"] = "All";
    BorderType["Inner"] = "Inner";
    BorderType["Outer"] = "Outer";
    BorderType["Top"] = "Top";
    BorderType["Right"] = "Right";
    BorderType["Bottom"] = "Bottom";
    BorderType["Left"] = "Left";
    BorderType["CenterH"] = "CenterH";
    BorderType["CenterV"] = "CenterV";
    BorderType["None"] = "None";
})(BorderType || (BorderType = {}));
export var BorderStyle;
(function (BorderStyle) {
    BorderStyle["Thin"] = "thin";
    BorderStyle["Medium"] = "medium";
    BorderStyle["Thick"] = "thick";
    BorderStyle["Double"] = "double";
    BorderStyle["Dotted"] = "dotted";
    BorderStyle["SlantDashDot"] = "slantdashdot";
    BorderStyle["MediumDashed"] = "mediumdashed";
    BorderStyle["MediumDashDotDot"] = "mediumdashdotdot";
    BorderStyle["MediumDashDot"] = "mediumdashdot";
})(BorderStyle || (BorderStyle = {}));

/* @ts-self-types="./wasm.d.ts" */
import { ic_tz_parts, ic_tz_validate } from './snippets/ironcalc_base-89b4f49381e1e289/inline0.js';

export class Model {
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(Model.prototype);
        obj.__wbg_ptr = ptr;
        ModelFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        ModelFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_model_free(ptr, 0);
    }
    /**
     * @param {number} sheet
     * @param {string} range
     * @param {CfRuleInput} rule
     */
    addConditionalFormatting(sheet, range, rule) {
        const ptr0 = passStringToWasm0(range, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.model_addConditionalFormatting(this.__wbg_ptr, sheet, ptr0, len0, rule);
        if (ret[1]) {
            throw takeFromExternrefTable0(ret[0]);
        }
    }
    /**
     * @param {Uint8Array} diffs
     */
    applyExternalDiffs(diffs) {
        const ptr0 = passArray8ToWasm0(diffs, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.model_applyExternalDiffs(this.__wbg_ptr, ptr0, len0);
        if (ret[1]) {
            throw takeFromExternrefTable0(ret[0]);
        }
    }
    /**
     * @param {Area} source_area
     * @param {number} to_column
     */
    autoFillColumns(source_area, to_column) {
        const ret = wasm.model_autoFillColumns(this.__wbg_ptr, source_area, to_column);
        if (ret[1]) {
            throw takeFromExternrefTable0(ret[0]);
        }
    }
    /**
     * @param {Area} source_area
     * @param {number} to_row
     */
    autoFillRows(source_area, to_row) {
        const ret = wasm.model_autoFillRows(this.__wbg_ptr, source_area, to_row);
        if (ret[1]) {
            throw takeFromExternrefTable0(ret[0]);
        }
    }
    /**
     * @returns {boolean}
     */
    canRedo() {
        const ret = wasm.model_canRedo(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * @returns {boolean}
     */
    canUndo() {
        const ret = wasm.model_canUndo(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * @returns {Clipboard}
     */
    copyToClipboard() {
        const ret = wasm.model_copyToClipboard(this.__wbg_ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    /**
     * @param {string} name
     * @param {CellStyle} style
     */
    createNamedStyle(name, style) {
        const ptr0 = passStringToWasm0(name, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.model_createNamedStyle(this.__wbg_ptr, ptr0, len0, style);
        if (ret[1]) {
            throw takeFromExternrefTable0(ret[0]);
        }
    }
    /**
     * @param {number} sheet
     * @param {number} column
     * @param {number} column_count
     */
    deleteColumns(sheet, column, column_count) {
        const ret = wasm.model_deleteColumns(this.__wbg_ptr, sheet, column, column_count);
        if (ret[1]) {
            throw takeFromExternrefTable0(ret[0]);
        }
    }
    /**
     * @param {number} sheet
     * @param {number} index
     */
    deleteConditionalFormatting(sheet, index) {
        const ret = wasm.model_deleteConditionalFormatting(this.__wbg_ptr, sheet, index);
        if (ret[1]) {
            throw takeFromExternrefTable0(ret[0]);
        }
    }
    /**
     * @param {string} name
     * @param {number | null} [scope]
     */
    deleteDefinedName(name, scope) {
        const ptr0 = passStringToWasm0(name, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.model_deleteDefinedName(this.__wbg_ptr, ptr0, len0, isLikeNone(scope) ? 0x100000001 : (scope) >>> 0);
        if (ret[1]) {
            throw takeFromExternrefTable0(ret[0]);
        }
    }
    /**
     * @param {string} name
     */
    deleteNamedStyle(name) {
        const ptr0 = passStringToWasm0(name, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.model_deleteNamedStyle(this.__wbg_ptr, ptr0, len0);
        if (ret[1]) {
            throw takeFromExternrefTable0(ret[0]);
        }
    }
    /**
     * @param {number} sheet
     * @param {number} row
     * @param {number} row_count
     */
    deleteRows(sheet, row, row_count) {
        const ret = wasm.model_deleteRows(this.__wbg_ptr, sheet, row, row_count);
        if (ret[1]) {
            throw takeFromExternrefTable0(ret[0]);
        }
    }
    /**
     * @param {number} sheet
     */
    deleteSheet(sheet) {
        const ret = wasm.model_deleteSheet(this.__wbg_ptr, sheet);
        if (ret[1]) {
            throw takeFromExternrefTable0(ret[0]);
        }
    }
    evaluate() {
        wasm.model_evaluate(this.__wbg_ptr);
    }
    /**
     * @returns {Uint8Array}
     */
    flushSendQueue() {
        const ret = wasm.model_flushSendQueue(this.__wbg_ptr);
        var v1 = getArrayU8FromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
        return v1;
    }
    /**
     * @param {Uint8Array} bytes
     * @param {string} language_id
     * @returns {Model}
     */
    static from_bytes(bytes, language_id) {
        const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passStringToWasm0(language_id, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        const ret = wasm.model_from_bytes(ptr0, len0, ptr1, len1);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return Model.__wrap(ret[0]);
    }
    /**
     * Returns all Excel built-in named styles as a `NamedStyle[]`.
     * These are always available regardless of whether the workbook uses them.
     * @returns {NamedStyle[]}
     */
    getBuiltinNamedStyles() {
        const ret = wasm.model_getBuiltinNamedStyles(this.__wbg_ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    /**
     * @param {number} sheet
     * @param {number} row
     * @param {number} column
     * @returns {CellArrayStructure}
     */
    getCellArrayStructure(sheet, row, column) {
        const ret = wasm.model_getCellArrayStructure(this.__wbg_ptr, sheet, row, column);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    /**
     * @param {number} sheet
     * @param {number} row
     * @param {number} column
     * @returns {string}
     */
    getCellContent(sheet, row, column) {
        let deferred2_0;
        let deferred2_1;
        try {
            const ret = wasm.model_getCellContent(this.__wbg_ptr, sheet, row, column);
            var ptr1 = ret[0];
            var len1 = ret[1];
            if (ret[3]) {
                ptr1 = 0; len1 = 0;
                throw takeFromExternrefTable0(ret[2]);
            }
            deferred2_0 = ptr1;
            deferred2_1 = len1;
            return getStringFromWasm0(ptr1, len1);
        } finally {
            wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
        }
    }
    /**
     * @param {number} sheet
     * @param {number} row
     * @param {number} column
     * @returns {ExtendedCellStyle}
     */
    getCellStyle(sheet, row, column) {
        const ret = wasm.model_getCellStyle(this.__wbg_ptr, sheet, row, column);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    /**
     * @param {number} sheet
     * @param {number} row
     * @param {number} column
     * @returns {number}
     */
    getCellType(sheet, row, column) {
        const ret = wasm.model_getCellType(this.__wbg_ptr, sheet, row, column);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return ret[0];
    }
    /**
     * @param {number} sheet
     * @param {number} column
     * @returns {number}
     */
    getColumnWidth(sheet, column) {
        const ret = wasm.model_getColumnWidth(this.__wbg_ptr, sheet, column);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return ret[0];
    }
    /**
     * @param {number} sheet
     * @param {number} row
     * @returns {Int32Array}
     */
    getColumnsWithData(sheet, row) {
        const ret = wasm.model_getColumnsWithData(this.__wbg_ptr, sheet, row);
        if (ret[3]) {
            throw takeFromExternrefTable0(ret[2]);
        }
        var v1 = getArrayI32FromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 4, 4);
        return v1;
    }
    /**
     * @param {number} sheet
     * @returns {ConditionalFormatting[]}
     */
    getConditionalFormattingList(sheet) {
        const ret = wasm.model_getConditionalFormattingList(this.__wbg_ptr, sheet);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    /**
     * @returns {DefinedName[]}
     */
    getDefinedNameList() {
        const ret = wasm.model_getDefinedNameList(this.__wbg_ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    /**
     * Bounding box of cells with data: `[min_row, min_col, max_row, max_col]`.
     * @param {number} sheet
     * @returns {Int32Array}
     */
    getDimension(sheet) {
        const ret = wasm.model_getDimension(this.__wbg_ptr, sheet);
        if (ret[3]) {
            throw takeFromExternrefTable0(ret[2]);
        }
        var v1 = getArrayI32FromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 4, 4);
        return v1;
    }
    /**
     * @param {number} sheet
     * @param {number} index
     * @returns {Dxf | null}
     */
    getDxfForConditionalFormatting(sheet, index) {
        const ret = wasm.model_getDxfForConditionalFormatting(this.__wbg_ptr, sheet, index);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    /**
     * @param {number} sheet
     * @param {number} row
     * @param {number} column
     * @returns {number | undefined}
     */
    getFirstNonEmptyInRowAfterColumn(sheet, row, column) {
        const ret = wasm.model_getFirstNonEmptyInRowAfterColumn(this.__wbg_ptr, sheet, row, column);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return ret[0] === 0x100000001 ? undefined : ret[0];
    }
    /**
     * Gets Settings format info
     * @returns {FmtSettings}
     */
    getFmtSettings() {
        const ret = wasm.model_getFmtSettings(this.__wbg_ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    /**
     * @param {number} sheet
     * @param {number} row
     * @param {number} column
     * @returns {string}
     */
    getFormattedCellValue(sheet, row, column) {
        let deferred2_0;
        let deferred2_1;
        try {
            const ret = wasm.model_getFormattedCellValue(this.__wbg_ptr, sheet, row, column);
            var ptr1 = ret[0];
            var len1 = ret[1];
            if (ret[3]) {
                ptr1 = 0; len1 = 0;
                throw takeFromExternrefTable0(ret[2]);
            }
            deferred2_0 = ptr1;
            deferred2_1 = len1;
            return getStringFromWasm0(ptr1, len1);
        } finally {
            wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
        }
    }
    /**
     * @param {number} sheet
     * @returns {number}
     */
    getFrozenColumnsCount(sheet) {
        const ret = wasm.model_getFrozenColumnsCount(this.__wbg_ptr, sheet);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return ret[0];
    }
    /**
     * @param {number} sheet
     * @returns {number}
     */
    getFrozenRowsCount(sheet) {
        const ret = wasm.model_getFrozenRowsCount(this.__wbg_ptr, sheet);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return ret[0];
    }
    /**
     * Gets the language of the model
     * @returns {string}
     */
    getLanguage() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.model_getLanguage(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @param {number} sheet
     * @param {number} row
     * @param {number} column
     * @returns {number | undefined}
     */
    getLastNonEmptyInRowBeforeColumn(sheet, row, column) {
        const ret = wasm.model_getLastNonEmptyInRowBeforeColumn(this.__wbg_ptr, sheet, row, column);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return ret[0] === 0x100000001 ? undefined : ret[0];
    }
    /**
     * Gets the locale of the model
     * @returns {string}
     */
    getLocale() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.model_getLocale(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * Merged cell ranges (e.g. `"A1:B2"`) for the given sheet.
     * @param {number} sheet
     * @returns {string[]}
     */
    getMergeCells(sheet) {
        const ret = wasm.model_getMergeCells(this.__wbg_ptr, sheet);
        if (ret[3]) {
            throw takeFromExternrefTable0(ret[2]);
        }
        var v1 = getArrayJsValueFromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 4, 4);
        return v1;
    }
    /**
     * @returns {string}
     */
    getName() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.model_getName(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @param {string} name
     * @returns {CellStyle}
     */
    getNamedStyle(name) {
        const ptr0 = passStringToWasm0(name, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.model_getNamedStyle(this.__wbg_ptr, ptr0, len0);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    /**
     * @returns {string[]}
     */
    getNamedStyleList() {
        const ret = wasm.model_getNamedStyleList(this.__wbg_ptr);
        var v1 = getArrayJsValueFromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 4, 4);
        return v1;
    }
    /**
     * @param {number} sheet
     * @param {number} row
     * @returns {number}
     */
    getRowHeight(sheet, row) {
        const ret = wasm.model_getRowHeight(this.__wbg_ptr, sheet, row);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return ret[0];
    }
    /**
     * @param {number} sheet
     * @param {number} column
     * @returns {Int32Array}
     */
    getRowsWithData(sheet, column) {
        const ret = wasm.model_getRowsWithData(this.__wbg_ptr, sheet, column);
        if (ret[3]) {
            throw takeFromExternrefTable0(ret[2]);
        }
        var v1 = getArrayI32FromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 4, 4);
        return v1;
    }
    /**
     * @returns {number}
     */
    getScrollX() {
        const ret = wasm.model_getScrollX(this.__wbg_ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return ret[0];
    }
    /**
     * @returns {number}
     */
    getScrollY() {
        const ret = wasm.model_getScrollY(this.__wbg_ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return ret[0];
    }
    /**
     * @returns {Int32Array}
     */
    getSelectedCell() {
        const ret = wasm.model_getSelectedCell(this.__wbg_ptr);
        var v1 = getArrayI32FromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 4, 4);
        return v1;
    }
    /**
     * @returns {number}
     */
    getSelectedSheet() {
        const ret = wasm.model_getSelectedSheet(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * @returns {SelectedView}
     */
    getSelectedView() {
        const ret = wasm.model_getSelectedView(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {number} sheet
     * @returns {boolean}
     */
    getShowGridLines(sheet) {
        const ret = wasm.model_getShowGridLines(this.__wbg_ptr, sheet);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return ret[0] !== 0;
    }
    /**
     * Returns the current workbook theme.
     * @returns {IronCalcTheme}
     */
    getTheme() {
        const ret = wasm.model_getTheme(this.__wbg_ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    /**
     * Gets the timezone of the model
     * @returns {string}
     */
    getTimezone() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.model_getTimezone(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @returns {WorksheetProperties[]}
     */
    getWorksheetsProperties() {
        const ret = wasm.model_getWorksheetsProperties(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {number} sheet
     */
    hideSheet(sheet) {
        const ret = wasm.model_hideSheet(this.__wbg_ptr, sheet);
        if (ret[1]) {
            throw takeFromExternrefTable0(ret[0]);
        }
    }
    /**
     * @param {number} sheet
     * @param {number} column
     * @param {number} column_count
     */
    insertColumns(sheet, column, column_count) {
        const ret = wasm.model_insertColumns(this.__wbg_ptr, sheet, column, column_count);
        if (ret[1]) {
            throw takeFromExternrefTable0(ret[0]);
        }
    }
    /**
     * @param {number} sheet
     * @param {number} row
     * @param {number} row_count
     */
    insertRows(sheet, row, row_count) {
        const ret = wasm.model_insertRows(this.__wbg_ptr, sheet, row, row_count);
        if (ret[1]) {
            throw takeFromExternrefTable0(ret[0]);
        }
    }
    /**
     * @param {string} name
     * @param {number | null | undefined} scope
     * @param {string} formula
     */
    isValidDefinedName(name, scope, formula) {
        const ptr0 = passStringToWasm0(name, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passStringToWasm0(formula, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        const ret = wasm.model_isValidDefinedName(this.__wbg_ptr, ptr0, len0, isLikeNone(scope) ? 0x100000001 : (scope) >>> 0, ptr1, len1);
        if (ret[1]) {
            throw takeFromExternrefTable0(ret[0]);
        }
    }
    /**
     * Loads a model directly from the bytes of an xlsx file, in the browser.
     * @param {Uint8Array} bytes
     * @param {string} name
     * @param {string} locale
     * @param {string} timezone
     * @param {string} language_id
     * @returns {Model}
     */
    static loadFromXlsx(bytes, name, locale, timezone, language_id) {
        const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passStringToWasm0(name, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        const ptr2 = passStringToWasm0(locale, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len2 = WASM_VECTOR_LEN;
        const ptr3 = passStringToWasm0(timezone, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len3 = WASM_VECTOR_LEN;
        const ptr4 = passStringToWasm0(language_id, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len4 = WASM_VECTOR_LEN;
        const ret = wasm.model_loadFromXlsx(ptr0, len0, ptr1, len1, ptr2, len2, ptr3, len3, ptr4, len4);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return Model.__wrap(ret[0]);
    }
    /**
     * @param {number} sheet
     * @param {number} column
     * @param {number} column_count
     * @param {number} delta
     */
    moveColumns(sheet, column, column_count, delta) {
        const ret = wasm.model_moveColumns(this.__wbg_ptr, sheet, column, column_count, delta);
        if (ret[1]) {
            throw takeFromExternrefTable0(ret[0]);
        }
    }
    /**
     * @param {number} sheet
     * @param {number} row
     * @param {number} row_count
     * @param {number} delta
     */
    moveRows(sheet, row, row_count, delta) {
        const ret = wasm.model_moveRows(this.__wbg_ptr, sheet, row, row_count, delta);
        if (ret[1]) {
            throw takeFromExternrefTable0(ret[0]);
        }
    }
    /**
     * @param {string} name
     * @param {string} locale
     * @param {string} timezone
     * @param {string} language_id
     */
    constructor(name, locale, timezone, language_id) {
        const ptr0 = passStringToWasm0(name, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passStringToWasm0(locale, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        const ptr2 = passStringToWasm0(timezone, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len2 = WASM_VECTOR_LEN;
        const ptr3 = passStringToWasm0(language_id, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len3 = WASM_VECTOR_LEN;
        const ret = wasm.model_new(ptr0, len0, ptr1, len1, ptr2, len2, ptr3, len3);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        this.__wbg_ptr = ret[0] >>> 0;
        ModelFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @param {string} name
     * @param {number | null | undefined} scope
     * @param {string} formula
     */
    newDefinedName(name, scope, formula) {
        const ptr0 = passStringToWasm0(name, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passStringToWasm0(formula, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        const ret = wasm.model_newDefinedName(this.__wbg_ptr, ptr0, len0, isLikeNone(scope) ? 0x100000001 : (scope) >>> 0, ptr1, len1);
        if (ret[1]) {
            throw takeFromExternrefTable0(ret[0]);
        }
    }
    newSheet() {
        const ret = wasm.model_newSheet(this.__wbg_ptr);
        if (ret[1]) {
            throw takeFromExternrefTable0(ret[0]);
        }
    }
    /**
     * Applies a named style to the current selection.
     * If the style is a built-in not yet in the workbook, it is added first.
     * @param {string} name
     */
    onApplyNamedStyle(name) {
        const ptr0 = passStringToWasm0(name, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.model_onApplyNamedStyle(this.__wbg_ptr, ptr0, len0);
        if (ret[1]) {
            throw takeFromExternrefTable0(ret[0]);
        }
    }
    /**
     * @param {number} target_row
     * @param {number} target_column
     */
    onAreaSelecting(target_row, target_column) {
        const ret = wasm.model_onAreaSelecting(this.__wbg_ptr, target_row, target_column);
        if (ret[1]) {
            throw takeFromExternrefTable0(ret[0]);
        }
    }
    onArrowDown() {
        const ret = wasm.model_onArrowDown(this.__wbg_ptr);
        if (ret[1]) {
            throw takeFromExternrefTable0(ret[0]);
        }
    }
    onArrowLeft() {
        const ret = wasm.model_onArrowLeft(this.__wbg_ptr);
        if (ret[1]) {
            throw takeFromExternrefTable0(ret[0]);
        }
    }
    onArrowRight() {
        const ret = wasm.model_onArrowRight(this.__wbg_ptr);
        if (ret[1]) {
            throw takeFromExternrefTable0(ret[0]);
        }
    }
    onArrowUp() {
        const ret = wasm.model_onArrowUp(this.__wbg_ptr);
        if (ret[1]) {
            throw takeFromExternrefTable0(ret[0]);
        }
    }
    /**
     * @param {string} key
     */
    onExpandSelectedRange(key) {
        const ptr0 = passStringToWasm0(key, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.model_onExpandSelectedRange(this.__wbg_ptr, ptr0, len0);
        if (ret[1]) {
            throw takeFromExternrefTable0(ret[0]);
        }
    }
    /**
     * @param {string} direction
     */
    onNavigateToEdgeInDirection(direction) {
        const ptr0 = passStringToWasm0(direction, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.model_onNavigateToEdgeInDirection(this.__wbg_ptr, ptr0, len0);
        if (ret[1]) {
            throw takeFromExternrefTable0(ret[0]);
        }
    }
    onPageDown() {
        const ret = wasm.model_onPageDown(this.__wbg_ptr);
        if (ret[1]) {
            throw takeFromExternrefTable0(ret[0]);
        }
    }
    onPageUp() {
        const ret = wasm.model_onPageUp(this.__wbg_ptr);
        if (ret[1]) {
            throw takeFromExternrefTable0(ret[0]);
        }
    }
    /**
     * @param {CellStyle[][]} styles
     */
    onPasteStyles(styles) {
        const ret = wasm.model_onPasteStyles(this.__wbg_ptr, styles);
        if (ret[1]) {
            throw takeFromExternrefTable0(ret[0]);
        }
    }
    /**
     * @param {Area} area
     * @param {string} csv
     */
    pasteCsvText(area, csv) {
        const ptr0 = passStringToWasm0(csv, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.model_pasteCsvText(this.__wbg_ptr, area, ptr0, len0);
        if (ret[1]) {
            throw takeFromExternrefTable0(ret[0]);
        }
    }
    /**
     * @param {number} source_sheet
     * @param {[number, number, number, number]} source_range
     * @param {ClipboardData} clipboard
     * @param {boolean} is_cut
     */
    pasteFromClipboard(source_sheet, source_range, clipboard, is_cut) {
        const ret = wasm.model_pasteFromClipboard(this.__wbg_ptr, source_sheet, source_range, clipboard, is_cut);
        if (ret[1]) {
            throw takeFromExternrefTable0(ret[0]);
        }
    }
    pauseEvaluation() {
        wasm.model_pauseEvaluation(this.__wbg_ptr);
    }
    /**
     * @param {number} sheet
     * @param {number} start_row
     * @param {number} start_column
     * @param {number} end_row
     * @param {number} end_column
     */
    rangeClearAll(sheet, start_row, start_column, end_row, end_column) {
        const ret = wasm.model_rangeClearAll(this.__wbg_ptr, sheet, start_row, start_column, end_row, end_column);
        if (ret[1]) {
            throw takeFromExternrefTable0(ret[0]);
        }
    }
    /**
     * @param {number} sheet
     * @param {number} start_row
     * @param {number} start_column
     * @param {number} end_row
     * @param {number} end_column
     */
    rangeClearContents(sheet, start_row, start_column, end_row, end_column) {
        const ret = wasm.model_rangeClearContents(this.__wbg_ptr, sheet, start_row, start_column, end_row, end_column);
        if (ret[1]) {
            throw takeFromExternrefTable0(ret[0]);
        }
    }
    /**
     * @param {number} sheet
     * @param {number} start_row
     * @param {number} start_column
     * @param {number} end_row
     * @param {number} end_column
     */
    rangeClearFormatting(sheet, start_row, start_column, end_row, end_column) {
        const ret = wasm.model_rangeClearFormatting(this.__wbg_ptr, sheet, start_row, start_column, end_row, end_column);
        if (ret[1]) {
            throw takeFromExternrefTable0(ret[0]);
        }
    }
    redo() {
        const ret = wasm.model_redo(this.__wbg_ptr);
        if (ret[1]) {
            throw takeFromExternrefTable0(ret[0]);
        }
    }
    /**
     * @param {number} sheet
     * @param {string} name
     */
    renameSheet(sheet, name) {
        const ptr0 = passStringToWasm0(name, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.model_renameSheet(this.__wbg_ptr, sheet, ptr0, len0);
        if (ret[1]) {
            throw takeFromExternrefTable0(ret[0]);
        }
    }
    /**
     * Resolves a `Color` value to a CSS hex string using the current workbook theme.
     * Accepts `Color`; returns `""` for absent/None colors.
     * @param {Color} color
     * @returns {string}
     */
    resolveColor(color) {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.model_resolveColor(this.__wbg_ptr, color);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    resumeEvaluation() {
        wasm.model_resumeEvaluation(this.__wbg_ptr);
    }
    /**
     * @param {Area} area
     * @param {BorderArea} border_area
     */
    setAreaWithBorder(area, border_area) {
        const ret = wasm.model_setAreaWithBorder(this.__wbg_ptr, area, border_area);
        if (ret[1]) {
            throw takeFromExternrefTable0(ret[0]);
        }
    }
    /**
     * @param {number} sheet
     * @param {number} column_start
     * @param {number} column_end
     * @param {boolean} hidden
     */
    setColumnsHidden(sheet, column_start, column_end, hidden) {
        const ret = wasm.model_setColumnsHidden(this.__wbg_ptr, sheet, column_start, column_end, hidden);
        if (ret[1]) {
            throw takeFromExternrefTable0(ret[0]);
        }
    }
    /**
     * @param {number} sheet
     * @param {number} column_start
     * @param {number} column_end
     * @param {number} width
     */
    setColumnsWidth(sheet, column_start, column_end, width) {
        const ret = wasm.model_setColumnsWidth(this.__wbg_ptr, sheet, column_start, column_end, width);
        if (ret[1]) {
            throw takeFromExternrefTable0(ret[0]);
        }
    }
    /**
     * @param {number} sheet
     * @param {number} count
     */
    setFrozenColumnsCount(sheet, count) {
        const ret = wasm.model_setFrozenColumnsCount(this.__wbg_ptr, sheet, count);
        if (ret[1]) {
            throw takeFromExternrefTable0(ret[0]);
        }
    }
    /**
     * @param {number} sheet
     * @param {number} count
     */
    setFrozenRowsCount(sheet, count) {
        const ret = wasm.model_setFrozenRowsCount(this.__wbg_ptr, sheet, count);
        if (ret[1]) {
            throw takeFromExternrefTable0(ret[0]);
        }
    }
    /**
     * Sets the language of the model
     * @param {string} language
     */
    setLanguage(language) {
        const ptr0 = passStringToWasm0(language, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.model_setLanguage(this.__wbg_ptr, ptr0, len0);
        if (ret[1]) {
            throw takeFromExternrefTable0(ret[0]);
        }
    }
    /**
     * @param {string} locale
     */
    setLocale(locale) {
        const ptr0 = passStringToWasm0(locale, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.model_setLocale(this.__wbg_ptr, ptr0, len0);
        if (ret[1]) {
            throw takeFromExternrefTable0(ret[0]);
        }
    }
    /**
     * @param {string} name
     */
    setName(name) {
        const ptr0 = passStringToWasm0(name, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.model_setName(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @param {number} sheet
     * @param {number} row_start
     * @param {number} row_end
     * @param {number} height
     */
    setRowsHeight(sheet, row_start, row_end, height) {
        const ret = wasm.model_setRowsHeight(this.__wbg_ptr, sheet, row_start, row_end, height);
        if (ret[1]) {
            throw takeFromExternrefTable0(ret[0]);
        }
    }
    /**
     * @param {number} sheet
     * @param {number} row_start
     * @param {number} row_end
     * @param {boolean} hidden
     */
    setRowsHidden(sheet, row_start, row_end, hidden) {
        const ret = wasm.model_setRowsHidden(this.__wbg_ptr, sheet, row_start, row_end, hidden);
        if (ret[1]) {
            throw takeFromExternrefTable0(ret[0]);
        }
    }
    /**
     * @param {number} row
     * @param {number} column
     */
    setSelectedCell(row, column) {
        const ret = wasm.model_setSelectedCell(this.__wbg_ptr, row, column);
        if (ret[1]) {
            throw takeFromExternrefTable0(ret[0]);
        }
    }
    /**
     * @param {number} start_row
     * @param {number} start_column
     * @param {number} end_row
     * @param {number} end_column
     */
    setSelectedRange(start_row, start_column, end_row, end_column) {
        const ret = wasm.model_setSelectedRange(this.__wbg_ptr, start_row, start_column, end_row, end_column);
        if (ret[1]) {
            throw takeFromExternrefTable0(ret[0]);
        }
    }
    /**
     * @param {number} sheet
     */
    setSelectedSheet(sheet) {
        const ret = wasm.model_setSelectedSheet(this.__wbg_ptr, sheet);
        if (ret[1]) {
            throw takeFromExternrefTable0(ret[0]);
        }
    }
    /**
     * @param {number} sheet
     * @param {Color} color
     */
    setSheetColor(sheet, color) {
        const ret = wasm.model_setSheetColor(this.__wbg_ptr, sheet, color);
        if (ret[1]) {
            throw takeFromExternrefTable0(ret[0]);
        }
    }
    /**
     * @param {number} sheet
     * @param {boolean} show_grid_lines
     */
    setShowGridLines(sheet, show_grid_lines) {
        const ret = wasm.model_setShowGridLines(this.__wbg_ptr, sheet, show_grid_lines);
        if (ret[1]) {
            throw takeFromExternrefTable0(ret[0]);
        }
    }
    /**
     * Sets the workbook theme.
     * @param {IronCalcTheme} theme
     */
    setTheme(theme) {
        const ret = wasm.model_setTheme(this.__wbg_ptr, theme);
        if (ret[1]) {
            throw takeFromExternrefTable0(ret[0]);
        }
    }
    /**
     * @param {string} timezone
     */
    setTimezone(timezone) {
        const ptr0 = passStringToWasm0(timezone, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.model_setTimezone(this.__wbg_ptr, ptr0, len0);
        if (ret[1]) {
            throw takeFromExternrefTable0(ret[0]);
        }
    }
    /**
     * @param {number} top_row
     * @param {number} top_column
     */
    setTopLeftVisibleCell(top_row, top_column) {
        const ret = wasm.model_setTopLeftVisibleCell(this.__wbg_ptr, top_row, top_column);
        if (ret[1]) {
            throw takeFromExternrefTable0(ret[0]);
        }
    }
    /**
     * @param {number} sheet
     * @param {number} row
     * @param {number} column
     * @param {number} width
     * @param {number} height
     * @param {string} formula
     */
    setUserArrayFormula(sheet, row, column, width, height, formula) {
        const ptr0 = passStringToWasm0(formula, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.model_setUserArrayFormula(this.__wbg_ptr, sheet, row, column, width, height, ptr0, len0);
        if (ret[1]) {
            throw takeFromExternrefTable0(ret[0]);
        }
    }
    /**
     * @param {number} sheet
     * @param {number} row
     * @param {number} column
     * @param {string} input
     */
    setUserInput(sheet, row, column, input) {
        const ptr0 = passStringToWasm0(input, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.model_setUserInput(this.__wbg_ptr, sheet, row, column, ptr0, len0);
        if (ret[1]) {
            throw takeFromExternrefTable0(ret[0]);
        }
    }
    /**
     * @param {number} window_height
     */
    setWindowHeight(window_height) {
        wasm.model_setWindowHeight(this.__wbg_ptr, window_height);
    }
    /**
     * @param {number} window_width
     */
    setWindowWidth(window_width) {
        wasm.model_setWindowWidth(this.__wbg_ptr, window_width);
    }
    /**
     * @returns {Uint8Array}
     */
    toBytes() {
        const ret = wasm.model_toBytes(this.__wbg_ptr);
        var v1 = getArrayU8FromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
        return v1;
    }
    undo() {
        const ret = wasm.model_undo(this.__wbg_ptr);
        if (ret[1]) {
            throw takeFromExternrefTable0(ret[0]);
        }
    }
    /**
     * @param {number} sheet
     */
    unhideSheet(sheet) {
        const ret = wasm.model_unhideSheet(this.__wbg_ptr, sheet);
        if (ret[1]) {
            throw takeFromExternrefTable0(ret[0]);
        }
    }
    /**
     * @param {number} sheet
     * @param {number} index
     * @param {string} new_range
     * @param {CfRuleInput} new_rule
     */
    updateConditionalFormatting(sheet, index, new_range, new_rule) {
        const ptr0 = passStringToWasm0(new_range, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.model_updateConditionalFormatting(this.__wbg_ptr, sheet, index, ptr0, len0, new_rule);
        if (ret[1]) {
            throw takeFromExternrefTable0(ret[0]);
        }
    }
    /**
     * @param {string} name
     * @param {number | null | undefined} scope
     * @param {string} new_name
     * @param {number | null | undefined} new_scope
     * @param {string} new_formula
     */
    updateDefinedName(name, scope, new_name, new_scope, new_formula) {
        const ptr0 = passStringToWasm0(name, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passStringToWasm0(new_name, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        const ptr2 = passStringToWasm0(new_formula, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len2 = WASM_VECTOR_LEN;
        const ret = wasm.model_updateDefinedName(this.__wbg_ptr, ptr0, len0, isLikeNone(scope) ? 0x100000001 : (scope) >>> 0, ptr1, len1, isLikeNone(new_scope) ? 0x100000001 : (new_scope) >>> 0, ptr2, len2);
        if (ret[1]) {
            throw takeFromExternrefTable0(ret[0]);
        }
    }
    /**
     * @param {string} name
     * @param {string} new_name
     * @param {CellStyle} style
     */
    updateNamedStyle(name, new_name, style) {
        const ptr0 = passStringToWasm0(name, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passStringToWasm0(new_name, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        const ret = wasm.model_updateNamedStyle(this.__wbg_ptr, ptr0, len0, ptr1, len1, style);
        if (ret[1]) {
            throw takeFromExternrefTable0(ret[0]);
        }
    }
    /**
     * @param {Area} range
     * @param {string} style_path
     * @param {string} value
     */
    updateRangeStyle(range, style_path, value) {
        const ptr0 = passStringToWasm0(style_path, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passStringToWasm0(value, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        const ret = wasm.model_updateRangeStyle(this.__wbg_ptr, range, ptr0, len0, ptr1, len1);
        if (ret[1]) {
            throw takeFromExternrefTable0(ret[0]);
        }
    }
}
if (Symbol.dispose) Model.prototype[Symbol.dispose] = Model.prototype.free;

/**
 * @param {number} column
 * @returns {string}
 */
export function columnNameFromNumber(column) {
    let deferred2_0;
    let deferred2_1;
    try {
        const ret = wasm.columnNameFromNumber(column);
        var ptr1 = ret[0];
        var len1 = ret[1];
        if (ret[3]) {
            ptr1 = 0; len1 = 0;
            throw takeFromExternrefTable0(ret[2]);
        }
        deferred2_0 = ptr1;
        deferred2_1 = len1;
        return getStringFromWasm0(ptr1, len1);
    } finally {
        wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
    }
}

/**
 * Gets all timezones
 * @returns {string[]}
 */
export function getAllTimezones() {
    const ret = wasm.getAllTimezones();
    var v1 = getArrayJsValueFromWasm0(ret[0], ret[1]).slice();
    wasm.__wbindgen_free(ret[0], ret[1] * 4, 4);
    return v1;
}

/**
 * Gets all supported locales
 * @returns {string[]}
 */
export function getSupportedLocales() {
    const ret = wasm.getSupportedLocales();
    var v1 = getArrayJsValueFromWasm0(ret[0], ret[1]).slice();
    wasm.__wbindgen_free(ret[0], ret[1] * 4, 4);
    return v1;
}

/**
 * Returns the list of builtin themes with their color slots.
 * @returns {IronCalcTheme[]}
 */
export function getThemeList() {
    const ret = wasm.getThemeList();
    return ret;
}

/**
 * Return an array with a list of all the tokens from a formula
 * This is used by the UI to color them according to a theme.
 * @param {string} formula
 * @returns {MarkedToken[]}
 */
export function getTokens(formula) {
    const ptr0 = passStringToWasm0(formula, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.getTokens(ptr0, len0);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return takeFromExternrefTable0(ret[0]);
}

/**
 * Tint algorithm
 * @param {string} hex
 * @param {number} tint
 * @returns {string}
 */
export function hexWithTintToRgb(hex, tint) {
    let deferred2_0;
    let deferred2_1;
    try {
        const ptr0 = passStringToWasm0(hex, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.hexWithTintToRgb(ptr0, len0, tint);
        deferred2_0 = ret[0];
        deferred2_1 = ret[1];
        return getStringFromWasm0(ret[0], ret[1]);
    } finally {
        wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
    }
}

/**
 * @param {string} name
 * @returns {string}
 */
export function quoteName(name) {
    let deferred2_0;
    let deferred2_1;
    try {
        const ptr0 = passStringToWasm0(name, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.quoteName(ptr0, len0);
        deferred2_0 = ret[0];
        deferred2_1 = ret[1];
        return getStringFromWasm0(ret[0], ret[1]);
    } finally {
        wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
    }
}
import * as import1 from "./snippets/ironcalc_base-89b4f49381e1e289/inline0.js"

function __wbg_get_imports() {
    const import0 = {
        __proto__: null,
        __wbg_Error_8c4e43fe74559d73: function(arg0, arg1) {
            const ret = Error(getStringFromWasm0(arg0, arg1));
            return ret;
        },
        __wbg_String_fed4d24b68977888: function(arg0, arg1) {
            const ret = String(arg1);
            const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len1 = WASM_VECTOR_LEN;
            getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
            getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
        },
        __wbg___wbindgen_bigint_get_as_i64_8fcf4ce7f1ca72a2: function(arg0, arg1) {
            const v = arg1;
            const ret = typeof(v) === 'bigint' ? v : undefined;
            getDataViewMemory0().setBigInt64(arg0 + 8 * 1, isLikeNone(ret) ? BigInt(0) : ret, true);
            getDataViewMemory0().setInt32(arg0 + 4 * 0, !isLikeNone(ret), true);
        },
        __wbg___wbindgen_boolean_get_bbbb1c18aa2f5e25: function(arg0) {
            const v = arg0;
            const ret = typeof(v) === 'boolean' ? v : undefined;
            return isLikeNone(ret) ? 0xFFFFFF : ret ? 1 : 0;
        },
        __wbg___wbindgen_debug_string_0bc8482c6e3508ae: function(arg0, arg1) {
            const ret = debugString(arg1);
            const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len1 = WASM_VECTOR_LEN;
            getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
            getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
        },
        __wbg___wbindgen_in_47fa6863be6f2f25: function(arg0, arg1) {
            const ret = arg0 in arg1;
            return ret;
        },
        __wbg___wbindgen_is_bigint_31b12575b56f32fc: function(arg0) {
            const ret = typeof(arg0) === 'bigint';
            return ret;
        },
        __wbg___wbindgen_is_function_0095a73b8b156f76: function(arg0) {
            const ret = typeof(arg0) === 'function';
            return ret;
        },
        __wbg___wbindgen_is_object_5ae8e5880f2c1fbd: function(arg0) {
            const val = arg0;
            const ret = typeof(val) === 'object' && val !== null;
            return ret;
        },
        __wbg___wbindgen_is_string_cd444516edc5b180: function(arg0) {
            const ret = typeof(arg0) === 'string';
            return ret;
        },
        __wbg___wbindgen_is_undefined_9e4d92534c42d778: function(arg0) {
            const ret = arg0 === undefined;
            return ret;
        },
        __wbg___wbindgen_jsval_eq_11888390b0186270: function(arg0, arg1) {
            const ret = arg0 === arg1;
            return ret;
        },
        __wbg___wbindgen_jsval_loose_eq_9dd77d8cd6671811: function(arg0, arg1) {
            const ret = arg0 == arg1;
            return ret;
        },
        __wbg___wbindgen_number_get_8ff4255516ccad3e: function(arg0, arg1) {
            const obj = arg1;
            const ret = typeof(obj) === 'number' ? obj : undefined;
            getDataViewMemory0().setFloat64(arg0 + 8 * 1, isLikeNone(ret) ? 0 : ret, true);
            getDataViewMemory0().setInt32(arg0 + 4 * 0, !isLikeNone(ret), true);
        },
        __wbg___wbindgen_string_get_72fb696202c56729: function(arg0, arg1) {
            const obj = arg1;
            const ret = typeof(obj) === 'string' ? obj : undefined;
            var ptr1 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            var len1 = WASM_VECTOR_LEN;
            getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
            getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
        },
        __wbg___wbindgen_throw_be289d5034ed271b: function(arg0, arg1) {
            throw new Error(getStringFromWasm0(arg0, arg1));
        },
        __wbg_call_389efe28435a9388: function() { return handleError(function (arg0, arg1) {
            const ret = arg0.call(arg1);
            return ret;
        }, arguments); },
        __wbg_done_57b39ecd9addfe81: function(arg0) {
            const ret = arg0.done;
            return ret;
        },
        __wbg_entries_58c7934c745daac7: function(arg0) {
            const ret = Object.entries(arg0);
            return ret;
        },
        __wbg_get_9b94d73e6221f75c: function(arg0, arg1) {
            const ret = arg0[arg1 >>> 0];
            return ret;
        },
        __wbg_get_b3ed3ad4be2bc8ac: function() { return handleError(function (arg0, arg1) {
            const ret = Reflect.get(arg0, arg1);
            return ret;
        }, arguments); },
        __wbg_get_with_ref_key_bb8f74a92cb2e784: function(arg0, arg1) {
            const ret = arg0[arg1];
            return ret;
        },
        __wbg_ic_tz_parts_1233457b3914b1fe: function(arg0, arg1, arg2) {
            const ret = ic_tz_parts(arg0, getStringFromWasm0(arg1, arg2));
            return ret;
        },
        __wbg_ic_tz_validate_7018a9939d5bef43: function(arg0, arg1) {
            const ret = ic_tz_validate(getStringFromWasm0(arg0, arg1));
            return ret;
        },
        __wbg_instanceof_ArrayBuffer_c367199e2fa2aa04: function(arg0) {
            let result;
            try {
                result = arg0 instanceof ArrayBuffer;
            } catch (_) {
                result = false;
            }
            const ret = result;
            return ret;
        },
        __wbg_instanceof_Uint8Array_9b9075935c74707c: function(arg0) {
            let result;
            try {
                result = arg0 instanceof Uint8Array;
            } catch (_) {
                result = false;
            }
            const ret = result;
            return ret;
        },
        __wbg_isArray_d314bb98fcf08331: function(arg0) {
            const ret = Array.isArray(arg0);
            return ret;
        },
        __wbg_isSafeInteger_bfbc7332a9768d2a: function(arg0) {
            const ret = Number.isSafeInteger(arg0);
            return ret;
        },
        __wbg_iterator_6ff6560ca1568e55: function() {
            const ret = Symbol.iterator;
            return ret;
        },
        __wbg_length_32ed9a279acd054c: function(arg0) {
            const ret = arg0.length;
            return ret;
        },
        __wbg_length_35a7bace40f36eac: function(arg0) {
            const ret = arg0.length;
            return ret;
        },
        __wbg_new_361308b2356cecd0: function() {
            const ret = new Object();
            return ret;
        },
        __wbg_new_3eb36ae241fe6f44: function() {
            const ret = new Array();
            return ret;
        },
        __wbg_new_dca287b076112a51: function() {
            const ret = new Map();
            return ret;
        },
        __wbg_new_dd2b680c8bf6ae29: function(arg0) {
            const ret = new Uint8Array(arg0);
            return ret;
        },
        __wbg_next_3482f54c49e8af19: function() { return handleError(function (arg0) {
            const ret = arg0.next();
            return ret;
        }, arguments); },
        __wbg_next_418f80d8f5303233: function(arg0) {
            const ret = arg0.next;
            return ret;
        },
        __wbg_now_a3af9a2f4bbaa4d1: function() {
            const ret = Date.now();
            return ret;
        },
        __wbg_prototypesetcall_bdcdcc5842e4d77d: function(arg0, arg1, arg2) {
            Uint8Array.prototype.set.call(getArrayU8FromWasm0(arg0, arg1), arg2);
        },
        __wbg_random_912284dbf636f269: function() {
            const ret = Math.random();
            return ret;
        },
        __wbg_set_1eb0999cf5d27fc8: function(arg0, arg1, arg2) {
            const ret = arg0.set(arg1, arg2);
            return ret;
        },
        __wbg_set_3fda3bac07393de4: function(arg0, arg1, arg2) {
            arg0[arg1] = arg2;
        },
        __wbg_set_f43e577aea94465b: function(arg0, arg1, arg2) {
            arg0[arg1 >>> 0] = arg2;
        },
        __wbg_value_0546255b415e96c1: function(arg0) {
            const ret = arg0.value;
            return ret;
        },
        __wbindgen_cast_0000000000000001: function(arg0) {
            // Cast intrinsic for `F64 -> Externref`.
            const ret = arg0;
            return ret;
        },
        __wbindgen_cast_0000000000000002: function(arg0) {
            // Cast intrinsic for `I64 -> Externref`.
            const ret = arg0;
            return ret;
        },
        __wbindgen_cast_0000000000000003: function(arg0, arg1) {
            // Cast intrinsic for `Ref(String) -> Externref`.
            const ret = getStringFromWasm0(arg0, arg1);
            return ret;
        },
        __wbindgen_cast_0000000000000004: function(arg0) {
            // Cast intrinsic for `U64 -> Externref`.
            const ret = BigInt.asUintN(64, arg0);
            return ret;
        },
        __wbindgen_init_externref_table: function() {
            const table = wasm.__wbindgen_externrefs;
            const offset = table.grow(4);
            table.set(0, undefined);
            table.set(offset + 0, undefined);
            table.set(offset + 1, null);
            table.set(offset + 2, true);
            table.set(offset + 3, false);
        },
    };
    return {
        __proto__: null,
        "./wasm_bg.js": import0,
        "./snippets/ironcalc_base-89b4f49381e1e289/inline0.js": import1,
    };
}

const ModelFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_model_free(ptr >>> 0, 1));

function addToExternrefTable0(obj) {
    const idx = wasm.__externref_table_alloc();
    wasm.__wbindgen_externrefs.set(idx, obj);
    return idx;
}

function debugString(val) {
    // primitive types
    const type = typeof val;
    if (type == 'number' || type == 'boolean' || val == null) {
        return  `${val}`;
    }
    if (type == 'string') {
        return `"${val}"`;
    }
    if (type == 'symbol') {
        const description = val.description;
        if (description == null) {
            return 'Symbol';
        } else {
            return `Symbol(${description})`;
        }
    }
    if (type == 'function') {
        const name = val.name;
        if (typeof name == 'string' && name.length > 0) {
            return `Function(${name})`;
        } else {
            return 'Function';
        }
    }
    // objects
    if (Array.isArray(val)) {
        const length = val.length;
        let debug = '[';
        if (length > 0) {
            debug += debugString(val[0]);
        }
        for(let i = 1; i < length; i++) {
            debug += ', ' + debugString(val[i]);
        }
        debug += ']';
        return debug;
    }
    // Test for built-in
    const builtInMatches = /\[object ([^\]]+)\]/.exec(toString.call(val));
    let className;
    if (builtInMatches && builtInMatches.length > 1) {
        className = builtInMatches[1];
    } else {
        // Failed to match the standard '[object ClassName]'
        return toString.call(val);
    }
    if (className == 'Object') {
        // we're a user defined class or Object
        // JSON.stringify avoids problems with cycles, and is generally much
        // easier than looping through ownProperties of `val`.
        try {
            return 'Object(' + JSON.stringify(val) + ')';
        } catch (_) {
            return 'Object';
        }
    }
    // errors
    if (val instanceof Error) {
        return `${val.name}: ${val.message}\n${val.stack}`;
    }
    // TODO we could test for more things here, like `Set`s and `Map`s.
    return className;
}

function getArrayI32FromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return getInt32ArrayMemory0().subarray(ptr / 4, ptr / 4 + len);
}

function getArrayJsValueFromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    const mem = getDataViewMemory0();
    const result = [];
    for (let i = ptr; i < ptr + 4 * len; i += 4) {
        result.push(wasm.__wbindgen_externrefs.get(mem.getUint32(i, true)));
    }
    wasm.__externref_drop_slice(ptr, len);
    return result;
}

function getArrayU8FromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return getUint8ArrayMemory0().subarray(ptr / 1, ptr / 1 + len);
}

let cachedDataViewMemory0 = null;
function getDataViewMemory0() {
    if (cachedDataViewMemory0 === null || cachedDataViewMemory0.buffer.detached === true || (cachedDataViewMemory0.buffer.detached === undefined && cachedDataViewMemory0.buffer !== wasm.memory.buffer)) {
        cachedDataViewMemory0 = new DataView(wasm.memory.buffer);
    }
    return cachedDataViewMemory0;
}

let cachedInt32ArrayMemory0 = null;
function getInt32ArrayMemory0() {
    if (cachedInt32ArrayMemory0 === null || cachedInt32ArrayMemory0.byteLength === 0) {
        cachedInt32ArrayMemory0 = new Int32Array(wasm.memory.buffer);
    }
    return cachedInt32ArrayMemory0;
}

function getStringFromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return decodeText(ptr, len);
}

let cachedUint8ArrayMemory0 = null;
function getUint8ArrayMemory0() {
    if (cachedUint8ArrayMemory0 === null || cachedUint8ArrayMemory0.byteLength === 0) {
        cachedUint8ArrayMemory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachedUint8ArrayMemory0;
}

function handleError(f, args) {
    try {
        return f.apply(this, args);
    } catch (e) {
        const idx = addToExternrefTable0(e);
        wasm.__wbindgen_exn_store(idx);
    }
}

function isLikeNone(x) {
    return x === undefined || x === null;
}

function passArray8ToWasm0(arg, malloc) {
    const ptr = malloc(arg.length * 1, 1) >>> 0;
    getUint8ArrayMemory0().set(arg, ptr / 1);
    WASM_VECTOR_LEN = arg.length;
    return ptr;
}

function passStringToWasm0(arg, malloc, realloc) {
    if (realloc === undefined) {
        const buf = cachedTextEncoder.encode(arg);
        const ptr = malloc(buf.length, 1) >>> 0;
        getUint8ArrayMemory0().subarray(ptr, ptr + buf.length).set(buf);
        WASM_VECTOR_LEN = buf.length;
        return ptr;
    }

    let len = arg.length;
    let ptr = malloc(len, 1) >>> 0;

    const mem = getUint8ArrayMemory0();

    let offset = 0;

    for (; offset < len; offset++) {
        const code = arg.charCodeAt(offset);
        if (code > 0x7F) break;
        mem[ptr + offset] = code;
    }
    if (offset !== len) {
        if (offset !== 0) {
            arg = arg.slice(offset);
        }
        ptr = realloc(ptr, len, len = offset + arg.length * 3, 1) >>> 0;
        const view = getUint8ArrayMemory0().subarray(ptr + offset, ptr + len);
        const ret = cachedTextEncoder.encodeInto(arg, view);

        offset += ret.written;
        ptr = realloc(ptr, len, offset, 1) >>> 0;
    }

    WASM_VECTOR_LEN = offset;
    return ptr;
}

function takeFromExternrefTable0(idx) {
    const value = wasm.__wbindgen_externrefs.get(idx);
    wasm.__externref_table_dealloc(idx);
    return value;
}

let cachedTextDecoder = new TextDecoder('utf-8', { ignoreBOM: true, fatal: true });
cachedTextDecoder.decode();
const MAX_SAFARI_DECODE_BYTES = 2146435072;
let numBytesDecoded = 0;
function decodeText(ptr, len) {
    numBytesDecoded += len;
    if (numBytesDecoded >= MAX_SAFARI_DECODE_BYTES) {
        cachedTextDecoder = new TextDecoder('utf-8', { ignoreBOM: true, fatal: true });
        cachedTextDecoder.decode();
        numBytesDecoded = len;
    }
    return cachedTextDecoder.decode(getUint8ArrayMemory0().subarray(ptr, ptr + len));
}

const cachedTextEncoder = new TextEncoder();

if (!('encodeInto' in cachedTextEncoder)) {
    cachedTextEncoder.encodeInto = function (arg, view) {
        const buf = cachedTextEncoder.encode(arg);
        view.set(buf);
        return {
            read: arg.length,
            written: buf.length
        };
    };
}

let WASM_VECTOR_LEN = 0;

let wasmModule, wasm;
function __wbg_finalize_init(instance, module) {
    wasm = instance.exports;
    wasmModule = module;
    cachedDataViewMemory0 = null;
    cachedInt32ArrayMemory0 = null;
    cachedUint8ArrayMemory0 = null;
    wasm.__wbindgen_start();
    return wasm;
}

async function __wbg_load(module, imports) {
    if (typeof Response === 'function' && module instanceof Response) {
        if (typeof WebAssembly.instantiateStreaming === 'function') {
            try {
                return await WebAssembly.instantiateStreaming(module, imports);
            } catch (e) {
                const validResponse = module.ok && expectedResponseType(module.type);

                if (validResponse && module.headers.get('Content-Type') !== 'application/wasm') {
                    console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve Wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n", e);

                } else { throw e; }
            }
        }

        const bytes = await module.arrayBuffer();
        return await WebAssembly.instantiate(bytes, imports);
    } else {
        const instance = await WebAssembly.instantiate(module, imports);

        if (instance instanceof WebAssembly.Instance) {
            return { instance, module };
        } else {
            return instance;
        }
    }

    function expectedResponseType(type) {
        switch (type) {
            case 'basic': case 'cors': case 'default': return true;
        }
        return false;
    }
}

function initSync(module) {
    if (wasm !== undefined) return wasm;


    if (module !== undefined) {
        if (Object.getPrototypeOf(module) === Object.prototype) {
            ({module} = module)
        } else {
            console.warn('using deprecated parameters for `initSync()`; pass a single object instead')
        }
    }

    const imports = __wbg_get_imports();
    if (!(module instanceof WebAssembly.Module)) {
        module = new WebAssembly.Module(module);
    }
    const instance = new WebAssembly.Instance(module, imports);
    return __wbg_finalize_init(instance, module);
}

async function __wbg_init(module_or_path) {
    if (wasm !== undefined) return wasm;


    if (module_or_path !== undefined) {
        if (Object.getPrototypeOf(module_or_path) === Object.prototype) {
            ({module_or_path} = module_or_path)
        } else {
            console.warn('using deprecated parameters for the initialization function; pass a single object instead')
        }
    }

    if (module_or_path === undefined) {
        module_or_path = new URL('wasm_bg.wasm', import.meta.url);
    }
    const imports = __wbg_get_imports();

    if (typeof module_or_path === 'string' || (typeof Request === 'function' && module_or_path instanceof Request) || (typeof URL === 'function' && module_or_path instanceof URL)) {
        module_or_path = fetch(module_or_path);
    }

    const { instance, module } = await __wbg_load(await module_or_path, imports);

    return __wbg_finalize_init(instance, module);
}

export { initSync, __wbg_init as default };
