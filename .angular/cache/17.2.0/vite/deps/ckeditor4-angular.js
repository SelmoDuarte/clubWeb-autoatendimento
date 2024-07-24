import {
  FormsModule,
  NG_VALUE_ACCESSOR
} from "./chunk-FI7ARHKK.js";
import {
  CommonModule
} from "./chunk-K2E7C5A7.js";
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  NgModule,
  NgZone,
  Output,
  forwardRef,
  setClassMetadata,
  ɵɵProvidersFeature,
  ɵɵdefineComponent,
  ɵɵdefineInjector,
  ɵɵdefineNgModule,
  ɵɵdirectiveInject,
  ɵɵtemplate
} from "./chunk-F5B7JWO3.js";
import "./chunk-SG3BCSKH.js";
import "./chunk-SAVXX6OM.js";
import "./chunk-PQ7O3X3G.js";
import {
  __spreadValues
} from "./chunk-WKYGNSYM.js";

// node_modules/ckeditor4-integrations-common/dist/index.esm.js
function loadScript(src, opts, cb) {
  var head = document.head || document.getElementsByTagName("head")[0];
  var script = document.createElement("script");
  if (typeof opts === "function") {
    cb = opts;
    opts = {};
  }
  opts = opts || {};
  cb = cb || function() {
  };
  script.type = opts.type || "text/javascript";
  script.charset = opts.charset || "utf8";
  script.async = "async" in opts ? !!opts.async : true;
  script.src = src;
  if (opts.attrs) {
    setAttributes(script, opts.attrs);
  }
  if (opts.text) {
    script.text = String(opts.text);
  }
  var onend = "onload" in script ? stdOnEnd : ieOnEnd;
  onend(script, cb);
  if (!script.onload) {
    stdOnEnd(script, cb);
  }
  head.appendChild(script);
}
function setAttributes(script, attrs) {
  for (var attr in attrs) {
    script.setAttribute(attr, attrs[attr]);
  }
}
function stdOnEnd(script, cb) {
  script.onload = function() {
    this.onerror = this.onload = null;
    cb(null, script);
  };
  script.onerror = function() {
    this.onerror = this.onload = null;
    cb(new Error("Failed to load " + this.src), script);
  };
}
function ieOnEnd(script, cb) {
  script.onreadystatechange = function() {
    if (this.readyState != "complete" && this.readyState != "loaded") {
      return;
    }
    this.onreadystatechange = null;
    cb(null, script);
  };
}
var promise;
function getEditorNamespace(editorURL, onNamespaceLoaded) {
  if ("CKEDITOR" in window) {
    return Promise.resolve(CKEDITOR);
  }
  if (typeof editorURL !== "string" || editorURL.length < 1) {
    return Promise.reject(new TypeError("CKEditor URL must be a non-empty string."));
  }
  if (!promise) {
    promise = getEditorNamespace.scriptLoader(editorURL).then(function(res) {
      if (onNamespaceLoaded) {
        onNamespaceLoaded(res);
      }
      return res;
    });
  }
  return promise;
}
getEditorNamespace.scriptLoader = function(editorURL) {
  return new Promise(function(scriptResolve, scriptReject) {
    loadScript(editorURL, function(err) {
      promise = void 0;
      if (err) {
        return scriptReject(err);
      } else if (!window.CKEDITOR) {
        return scriptReject(new Error("Script loaded from editorUrl doesn't provide CKEDITOR namespace."));
      }
      scriptResolve(CKEDITOR);
    });
  });
};

// node_modules/ckeditor4-angular/fesm2020/ckeditor4-angular.mjs
function CKEditorComponent_ng_template_0_Template(rf, ctx) {
}
var CKEditorComponent = class {
  constructor(elementRef, ngZone) {
    this.elementRef = elementRef;
    this.ngZone = ngZone;
    this.editorUrl = "https://cdn.ckeditor.com/4.24.0-lts/standard-all/ckeditor.js";
    this.tagName = "textarea";
    this.type = "classic";
    this.namespaceLoaded = new EventEmitter();
    this.ready = new EventEmitter();
    this.dataReady = new EventEmitter();
    this.change = new EventEmitter();
    this.dataChange = new EventEmitter();
    this.dragStart = new EventEmitter();
    this.dragEnd = new EventEmitter();
    this.drop = new EventEmitter();
    this.fileUploadResponse = new EventEmitter();
    this.fileUploadRequest = new EventEmitter();
    this.focus = new EventEmitter();
    this.paste = new EventEmitter();
    this.afterPaste = new EventEmitter();
    this.blur = new EventEmitter();
    this._readOnly = null;
    this._data = null;
    this._destroyed = false;
  }
  /**
   * Keeps track of the editor's data.
   *
   * It's also decorated as an input which is useful when not using the ngModel.
   *
   * See https://angular.io/api/forms/NgModel to learn more.
   */
  set data(data) {
    if (data === this._data) {
      return;
    }
    if (this.instance) {
      this.instance.setData(data);
      this._data = this.instance.getData();
      return;
    }
    this._data = data;
  }
  get data() {
    return this._data;
  }
  /**
   * When set to `true`, the editor becomes read-only.
   *
   * See https://ckeditor.com/docs/ckeditor4/latest/api/CKEDITOR_editor.html#property-readOnly
   * to learn more.
   */
  set readOnly(isReadOnly) {
    if (this.instance) {
      this.instance.setReadOnly(isReadOnly);
      return;
    }
    this._readOnly = isReadOnly;
  }
  get readOnly() {
    if (this.instance) {
      return this.instance.readOnly;
    }
    return this._readOnly;
  }
  ngAfterViewInit() {
    getEditorNamespace(this.editorUrl, (namespace) => {
      this.namespaceLoaded.emit(namespace);
    }).then(() => {
      if (this._destroyed) {
        return;
      }
      this.ngZone.runOutsideAngular(this.createEditor.bind(this));
    }).catch(window.console.error);
  }
  ngOnDestroy() {
    this._destroyed = true;
    this.ngZone.runOutsideAngular(() => {
      if (this.instance) {
        this.instance.destroy();
        this.instance = null;
      }
    });
  }
  writeValue(value) {
    this.data = value;
  }
  registerOnChange(callback) {
    this.onChange = callback;
  }
  registerOnTouched(callback) {
    this.onTouched = callback;
  }
  createEditor() {
    const element = document.createElement(this.tagName);
    this.elementRef.nativeElement.appendChild(element);
    const userInstanceReadyCallback = this.config?.on?.instanceReady;
    const defaultConfig = {
      delayIfDetached: true
    };
    const config = __spreadValues(__spreadValues({}, defaultConfig), this.config);
    if (typeof config.on === "undefined") {
      config.on = {};
    }
    config.on.instanceReady = (evt) => {
      const editor = evt.editor;
      this.instance = editor;
      this.readOnly = this._readOnly !== null ? this._readOnly : this.instance.readOnly;
      this.subscribe(this.instance);
      const undo = editor.undoManager;
      if (this.data !== null) {
        undo && undo.lock();
        editor.setData(this.data, {
          callback: () => {
            if (this.data !== editor.getData()) {
              undo ? editor.fire("change") : editor.fire("dataReady");
            }
            undo && undo.unlock();
            this.ngZone.run(() => {
              if (typeof userInstanceReadyCallback === "function") {
                userInstanceReadyCallback(evt);
              }
              this.ready.emit(evt);
            });
          }
        });
      } else {
        this.ngZone.run(() => {
          if (typeof userInstanceReadyCallback === "function") {
            userInstanceReadyCallback(evt);
          }
          this.ready.emit(evt);
        });
      }
    };
    if (this.type === "inline") {
      CKEDITOR.inline(element, config);
    } else {
      CKEDITOR.replace(element, config);
    }
  }
  subscribe(editor) {
    editor.on("focus", (evt) => {
      this.ngZone.run(() => {
        this.focus.emit(evt);
      });
    });
    editor.on("paste", (evt) => {
      this.ngZone.run(() => {
        this.paste.emit(evt);
      });
    });
    editor.on("afterPaste", (evt) => {
      this.ngZone.run(() => {
        this.afterPaste.emit(evt);
      });
    });
    editor.on("dragend", (evt) => {
      this.ngZone.run(() => {
        this.dragEnd.emit(evt);
      });
    });
    editor.on("dragstart", (evt) => {
      this.ngZone.run(() => {
        this.dragStart.emit(evt);
      });
    });
    editor.on("drop", (evt) => {
      this.ngZone.run(() => {
        this.drop.emit(evt);
      });
    });
    editor.on("fileUploadRequest", (evt) => {
      this.ngZone.run(() => {
        this.fileUploadRequest.emit(evt);
      });
    });
    editor.on("fileUploadResponse", (evt) => {
      this.ngZone.run(() => {
        this.fileUploadResponse.emit(evt);
      });
    });
    editor.on("blur", (evt) => {
      this.ngZone.run(() => {
        if (this.onTouched) {
          this.onTouched();
        }
        this.blur.emit(evt);
      });
    });
    editor.on("dataReady", this.propagateChange, this);
    if (this.instance.undoManager) {
      editor.on("change", this.propagateChange, this);
    } else {
      editor.on("selectionCheck", this.propagateChange, this);
    }
  }
  propagateChange(event) {
    this.ngZone.run(() => {
      const newData = this.instance.getData();
      if (event.name === "change") {
        this.change.emit(event);
      } else if (event.name === "dataReady") {
        this.dataReady.emit(event);
      }
      if (newData === this.data) {
        return;
      }
      this._data = newData;
      this.dataChange.emit(newData);
      if (this.onChange) {
        this.onChange(newData);
      }
    });
  }
};
CKEditorComponent.ɵfac = function CKEditorComponent_Factory(t) {
  return new (t || CKEditorComponent)(ɵɵdirectiveInject(ElementRef), ɵɵdirectiveInject(NgZone));
};
CKEditorComponent.ɵcmp = ɵɵdefineComponent({
  type: CKEditorComponent,
  selectors: [["ckeditor"]],
  inputs: {
    config: "config",
    editorUrl: "editorUrl",
    tagName: "tagName",
    type: "type",
    data: "data",
    readOnly: "readOnly"
  },
  outputs: {
    namespaceLoaded: "namespaceLoaded",
    ready: "ready",
    dataReady: "dataReady",
    change: "change",
    dataChange: "dataChange",
    dragStart: "dragStart",
    dragEnd: "dragEnd",
    drop: "drop",
    fileUploadResponse: "fileUploadResponse",
    fileUploadRequest: "fileUploadRequest",
    focus: "focus",
    paste: "paste",
    afterPaste: "afterPaste",
    blur: "blur"
  },
  features: [ɵɵProvidersFeature([{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => CKEditorComponent),
    multi: true
  }])],
  decls: 1,
  vars: 0,
  template: function CKEditorComponent_Template(rf, ctx) {
    if (rf & 1) {
      ɵɵtemplate(0, CKEditorComponent_ng_template_0_Template, 0, 0, "ng-template");
    }
  },
  encapsulation: 2
});
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(CKEditorComponent, [{
    type: Component,
    args: [{
      selector: "ckeditor",
      template: "<ng-template></ng-template>",
      providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => CKEditorComponent),
        multi: true
      }]
    }]
  }], function() {
    return [{
      type: ElementRef
    }, {
      type: NgZone
    }];
  }, {
    config: [{
      type: Input
    }],
    editorUrl: [{
      type: Input
    }],
    tagName: [{
      type: Input
    }],
    type: [{
      type: Input
    }],
    data: [{
      type: Input
    }],
    readOnly: [{
      type: Input
    }],
    namespaceLoaded: [{
      type: Output
    }],
    ready: [{
      type: Output
    }],
    dataReady: [{
      type: Output
    }],
    change: [{
      type: Output
    }],
    dataChange: [{
      type: Output
    }],
    dragStart: [{
      type: Output
    }],
    dragEnd: [{
      type: Output
    }],
    drop: [{
      type: Output
    }],
    fileUploadResponse: [{
      type: Output
    }],
    fileUploadRequest: [{
      type: Output
    }],
    focus: [{
      type: Output
    }],
    paste: [{
      type: Output
    }],
    afterPaste: [{
      type: Output
    }],
    blur: [{
      type: Output
    }]
  });
})();
var CKEditorModule = class {
};
CKEditorModule.ɵfac = function CKEditorModule_Factory(t) {
  return new (t || CKEditorModule)();
};
CKEditorModule.ɵmod = ɵɵdefineNgModule({
  type: CKEditorModule,
  declarations: [CKEditorComponent],
  imports: [FormsModule, CommonModule],
  exports: [CKEditorComponent]
});
CKEditorModule.ɵinj = ɵɵdefineInjector({
  imports: [[FormsModule, CommonModule]]
});
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(CKEditorModule, [{
    type: NgModule,
    args: [{
      imports: [FormsModule, CommonModule],
      declarations: [CKEditorComponent],
      exports: [CKEditorComponent]
    }]
  }], null, null);
})();
export {
  CKEditorComponent,
  CKEditorModule
};
/*! Bundled license information:

ckeditor4-integrations-common/dist/index.esm.js:
  (**
   * @license Copyright (c) 2003-2021, CKSource - Frederico Knabben. All rights reserved.
   * For licensing, see LICENSE.md.
   *)

ckeditor4-angular/fesm2020/ckeditor4-angular.mjs:
  (**
   * @license Copyright (c) 2003-2023, CKSource Holding sp. z o.o. All rights reserved.
   * For licensing, see LICENSE.md.
   *)
*/
//# sourceMappingURL=ckeditor4-angular.js.map
