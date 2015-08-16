(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
$(document).ready(function() {

  // 表单校验
  var $validator = $("#commentForm").validate({
    rules: {
      J_Datefield: {
        required: true
      },
      J_Timefield: {
        required: true
      },
      J_Dept: {
        required: true
      },
      J_Class: {
        required: true
      },
      J_finder: {
        required: true
      },
      J_Chanel: {
        required: true
      },
      J_Program: {
        required: true
      },
      J_Section: {
        required: true
      },
      J_Playtime: {
        required: true
      },
      J_Event: {
        required: true
      },
      J_Error: {
        required: true
      },
      J_Question: {
        required: true
      },
      J_Desc: {
        required: true
      }
    }
  });

  // 初始化流程
  $('#rootwizard').bootstrapWizard({
    'tabClass': 'nav nav-pills',
    'onNext': function(tab, navigation, index) {
      var $valid = $("#commentForm").valid();
      if(!$valid) {
        $validator.focusInvalid();
        return false;
      }
    }
  });
});

},{}]},{},[1]);
