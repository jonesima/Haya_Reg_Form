"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.supabase = void 0;

var _supabaseJs = require("@supabase/supabase-js");

var supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
var supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
var supabase = (0, _supabaseJs.createClient)(supabaseUrl, supabaseKey);
exports.supabase = supabase;