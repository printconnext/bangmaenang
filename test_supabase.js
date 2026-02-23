const fs = require('fs');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

const dom = new JSDOM(`<!DOCTYPE html><p>Hello world</p>`);
global.window = dom.window;
global.document = dom.window.document;

const script = fs.readFileSync('supabase_cdn.js', 'utf8');
eval(script);

console.log(Object.keys(window.supabase));
const client = window.supabase.createClient('https://hjbtqjrnqkgzfrjdvscz.supabase.co', 'sb_publishable_DpB9zJmvwtNCRUXIxQ7I8Q_dtY4W7gx');
console.log(client ? "client generated" : "no client");
console.log("Client keys:", Object.keys(client));
if (client.storage) {
    console.log("Storage keys:", Object.keys(client.storage));
} else {
    console.log("Storage is undefined!");
}
