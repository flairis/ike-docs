/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "vendor-chunks/@markdoc";
exports.ids = ["vendor-chunks/@markdoc"];
exports.modules = {

/***/ "./node_modules/@markdoc/next.js/src/runtime.js":
/*!******************************************************!*\
  !*** ./node_modules/@markdoc/next.js/src/runtime.js ***!
  \******************************************************/
/***/ ((__unused_webpack_module, exports) => {

eval("// IDEA: explore better displayName functions\nfunction displayName(name) {\n  // Pascal case\n  return name\n    .match(/[a-z]+/gi)\n    .map((word) => word.charAt(0).toUpperCase() + word.substr(1).toLowerCase())\n    .join('');\n}\n\nfunction transformRecord(config) {\n  const output = {};\n  const components = {};\n\n  if (config) {\n    Object.entries(config).forEach(([name, registration]) => {\n      if (output[name]) {\n        throw new Error(`\"${name}\" has already been declared`);\n      }\n\n      const componentName = registration.render ? displayName(name) : undefined;\n\n      output[name] = {\n        ...registration,\n        render: componentName,\n      };\n\n      if (componentName) {\n        components[componentName] = registration.render;\n      }\n    });\n  }\n\n  return {output, components};\n}\n\nexports.getSchema = function getSchema(schema) {\n  const {output: tags, components: tagComponents} = transformRecord(\n    schema.tags\n  );\n\n  const {output: nodes, components: nodeComponents} = transformRecord(\n    schema.nodes\n  );\n\n  return {\n    ...schema,\n    tags,\n    nodes,\n    components: {\n      ...tagComponents,\n      ...nodeComponents,\n    },\n  };\n};\n\nexports.defaultObject = function defaultObject(o) {\n  if (Object.prototype.hasOwnProperty.call(o, 'default')) return o.default;\n  return o || {};\n};\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9ub2RlX21vZHVsZXMvQG1hcmtkb2MvbmV4dC5qcy9zcmMvcnVudGltZS5qcyIsIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSw0QkFBNEIsS0FBSztBQUNqQzs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7O0FBRUEsVUFBVTtBQUNWOztBQUVBLGlCQUFpQjtBQUNqQixTQUFTLHlDQUF5QztBQUNsRDtBQUNBOztBQUVBLFNBQVMsMkNBQTJDO0FBQ3BEO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTs7QUFFQSxxQkFBcUI7QUFDckI7QUFDQTtBQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL0BtYXJrZG9jL25leHQuanMvc3JjL3J1bnRpbWUuanM/MmQ1OSJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyBJREVBOiBleHBsb3JlIGJldHRlciBkaXNwbGF5TmFtZSBmdW5jdGlvbnNcbmZ1bmN0aW9uIGRpc3BsYXlOYW1lKG5hbWUpIHtcbiAgLy8gUGFzY2FsIGNhc2VcbiAgcmV0dXJuIG5hbWVcbiAgICAubWF0Y2goL1thLXpdKy9naSlcbiAgICAubWFwKCh3b3JkKSA9PiB3b3JkLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgd29yZC5zdWJzdHIoMSkudG9Mb3dlckNhc2UoKSlcbiAgICAuam9pbignJyk7XG59XG5cbmZ1bmN0aW9uIHRyYW5zZm9ybVJlY29yZChjb25maWcpIHtcbiAgY29uc3Qgb3V0cHV0ID0ge307XG4gIGNvbnN0IGNvbXBvbmVudHMgPSB7fTtcblxuICBpZiAoY29uZmlnKSB7XG4gICAgT2JqZWN0LmVudHJpZXMoY29uZmlnKS5mb3JFYWNoKChbbmFtZSwgcmVnaXN0cmF0aW9uXSkgPT4ge1xuICAgICAgaWYgKG91dHB1dFtuYW1lXSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYFwiJHtuYW1lfVwiIGhhcyBhbHJlYWR5IGJlZW4gZGVjbGFyZWRgKTtcbiAgICAgIH1cblxuICAgICAgY29uc3QgY29tcG9uZW50TmFtZSA9IHJlZ2lzdHJhdGlvbi5yZW5kZXIgPyBkaXNwbGF5TmFtZShuYW1lKSA6IHVuZGVmaW5lZDtcblxuICAgICAgb3V0cHV0W25hbWVdID0ge1xuICAgICAgICAuLi5yZWdpc3RyYXRpb24sXG4gICAgICAgIHJlbmRlcjogY29tcG9uZW50TmFtZSxcbiAgICAgIH07XG5cbiAgICAgIGlmIChjb21wb25lbnROYW1lKSB7XG4gICAgICAgIGNvbXBvbmVudHNbY29tcG9uZW50TmFtZV0gPSByZWdpc3RyYXRpb24ucmVuZGVyO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgcmV0dXJuIHtvdXRwdXQsIGNvbXBvbmVudHN9O1xufVxuXG5leHBvcnRzLmdldFNjaGVtYSA9IGZ1bmN0aW9uIGdldFNjaGVtYShzY2hlbWEpIHtcbiAgY29uc3Qge291dHB1dDogdGFncywgY29tcG9uZW50czogdGFnQ29tcG9uZW50c30gPSB0cmFuc2Zvcm1SZWNvcmQoXG4gICAgc2NoZW1hLnRhZ3NcbiAgKTtcblxuICBjb25zdCB7b3V0cHV0OiBub2RlcywgY29tcG9uZW50czogbm9kZUNvbXBvbmVudHN9ID0gdHJhbnNmb3JtUmVjb3JkKFxuICAgIHNjaGVtYS5ub2Rlc1xuICApO1xuXG4gIHJldHVybiB7XG4gICAgLi4uc2NoZW1hLFxuICAgIHRhZ3MsXG4gICAgbm9kZXMsXG4gICAgY29tcG9uZW50czoge1xuICAgICAgLi4udGFnQ29tcG9uZW50cyxcbiAgICAgIC4uLm5vZGVDb21wb25lbnRzLFxuICAgIH0sXG4gIH07XG59O1xuXG5leHBvcnRzLmRlZmF1bHRPYmplY3QgPSBmdW5jdGlvbiBkZWZhdWx0T2JqZWN0KG8pIHtcbiAgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvLCAnZGVmYXVsdCcpKSByZXR1cm4gby5kZWZhdWx0O1xuICByZXR1cm4gbyB8fCB7fTtcbn07XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./node_modules/@markdoc/next.js/src/runtime.js\n");

/***/ })

};
;