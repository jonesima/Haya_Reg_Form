"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.supabase = void 0;

var _supabaseJs = require("@supabase/supabase-js");

// lib/supabaseClient.js
var supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
var supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
var supabase = (0, _supabaseJs.createClient)(supabaseUrl, supabaseAnonKey);
exports.supabase = supabase;