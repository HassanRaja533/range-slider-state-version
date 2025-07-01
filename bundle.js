(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
(function (__filename){(function (){
const STATE = require('STATE') // Import custom STATE module for managing local state and drive
const statedb = STATE(__filename) // Bind STATE to this module file for namespaced storage
const { sdb, get } = statedb(fallback_module) // Initialize state DB with fallback data and get tools

module.exports = range_slider

  let input_id = 0

async function range_slider(opts, protocol) {
   
  console.log('SID:', opts.sid)
   const { id, sdb } = await get(opts.sid)

  const on = {
    value: handleValue,
    style: inject
  }
   await sdb.watch(onbatch)
   const config = await sdb.drive.get('data/opts.json')
   const { min = 0, max = 1000 } = config
   const name = `range-slider-${input_id++}`
   const state = {}

 function protocol (message, notify) {
    const { from } = message
    state[from] = { value: 0, notify }
    return listen
 }

   const notify = protocol({ from: name }, listen)

  function listen (message) {
    const { type, data } = message
    if (type === 'update') {
      input.value = data
    }
    fill.style.width = `${(data / max) * 100}%`
    input.focus()
  }


   const el = document.createElement('div')
   el.classList.add('container')
   const shadow = el.attachShadow({ mode: 'closed' })

   const input = document.createElement('input')
   input.type = 'range'
   input.min = min
   input.max = max
   input.value = min

   input.oninput = handle_input

   const bar = document.createElement('div')
   bar.classList.add('bar')

   const ruler = document.createElement('div')
   ruler.classList.add('ruler')

   fill = document.createElement('div') // make accessible
   fill.classList.add('fill')

  // Get and inject the CSS from virtual drive
   const css = await sdb.drive.get('style/theme.css')
   inject(css)

   bar.append(ruler, fill)

   shadow.append( input, bar)

  function inject(data) {
    console.log('Injecting style:', data)
    const sheet = new CSSStyleSheet()

    if (data?.raw) {
    sheet.replaceSync(data.raw || '') // ensure raw exists
    shadow.adoptedStyleSheets = [sheet]
    }
  }

  return el

  // handler
  function handle_input (e) {
    const val = Number(e.target.value)
    fill.style.width = `${(val / max) * 100}%`
    notify({ from: name, type: 'update', data: val })
  }

  function onbatch (batch) {
     for (const { type, data } of batch) {
       on[type] && on[type](data)
     }
  }

  function handleValue(data) {
    console.log(`✅ SID "${data.id}" value is now:`, data.value)
  }
}  

// ============ Fallback Setup for STATE ============

// This fallback_module function is required for STATE initialization
function fallback_module () {
  return {
    drive: {},
    api: fallback_instance,// Used to customize API (like styles or icons)
  }

  function fallback_instance(opts) {
  console.log('make instance:', opts);
  return {
    drive: {
      'style/': {
        'theme.css': {
          raw: `
            :host {
              box-sizing: border-box;
              --white       : hsla(0, 0%, 100%, 1);
              --transparent : hsla(0, 0%, 0%, 0);
              --grey        : hsla(0, 0%, 90%, 1);
              --blue        : hsla(207, 88%, 66%, 1);
              position: relative;
              width: 100%;
              height: 16px;
            }

            *, *::before, *::after {
              box-sizing: inherit;
            }

            input {
              position: absolute;
              top: 0;
              left: 0;
              width: 100%;
              -webkit-appearance: none;
              outline: none;
              margin: 0;
              z-index: 2;
              background-color: var(--transparent);
            }

            .bar {
              position: absolute;
              top: 3px;
              left: 0;
              z-index: 0;
              height: 10px;
              width: 100%;
              border-radius: 8px;
              overflow: hidden;
              background-color: var(--grey);
              display: flex;
              flex-direction: column;
              justify-content: center;
            }

            .ruler {
              position: absolute;
              height: 6px;
              width: 100%;
              transform: scale(-1, 1);
              background-size: 20px 8px;
              background-image: repeating-linear-gradient(
                to right,
                var(--grey) 0px,
                var(--grey) 17px,
                var(--white) 17px,
                var(--white) 20px
              );
            }

            .fill {
              position: absolute;
              height: 100%;
              width: 0%;
              background-color: var(--grey);
            }

            input:focus + .bar .fill,
            input:focus-within + .bar .fill,
            input:active + .bar .fill {
              background-color: var(--blue);
            }

            input::-webkit-slider-thumb {
              -webkit-appearance: none;
              width: 16px;
              height: 16px;
              border-radius: 50%;
              background-color: var(--white);
              border: 1px solid var(--grey);
              cursor: pointer;
              box-shadow: 0 3px 6px rgba(0, 0, 0, 0.4);
              transition: background-color 0.3s, box-shadow 0.15s linear;
            }

            input::-webkit-slider-thumb:hover {
              box-shadow: 0 0 0 14px rgba(94, 176, 245, 0.8);
            }

            input::-moz-range-thumb {
              width: 16px;
              height: 16px;
              border-radius: 50%;
              background-color: var(--white);
              border: 1px solid var(--grey);
              cursor: pointer;
              box-shadow: 0 3px 6px rgba(0, 0, 0, 0.4);
              transition: background-color 0.3s, box-shadow 0.15s linear;
            }

            input::-moz-range-thumb:hover {
              box-shadow: 0 0 0 14px rgba(94, 176, 245, 0.8);
            }
          `
        }
      },

      'data/': {
        'opts.json': {
          raw: opts
        }
      }
    }
  };
 }
}





/*
const STATE = require('STATE') // Import custom STATE module for managing local state and drive
const statedb = STATE(__filename) // Bind STATE to this module file for namespaced storage
const { sdb, get } = statedb(fallback_module) // Initialize state DB with fallback data and get tools


module.exports = range_slider

  const style = document.createElement('style')
  let input_id = 0

async function  range_slider (opts, protocol) {

  console.log (opts.sid) 
  const { id, sdb } = await get(opts.sid)
    
 const on = {
  value: handleValue,
  style: inject
 }

  // Handle value updates
 function handleValue(data) {
  console.log(`✅ SID "${data.id}" value is now:`, data.value)
 }

  // Load config from drive/data/opts.json (fallback will provide defaults)
  const config = await sdb.drive.get('data/opts.json')
    
  const { min = 0, max = 1000 } = config
  const name = `range-slider-${input_id++}`
  const state = {}

 function protocol (message, notify) {
    const { from } = message
    state[from] = { value: 0, notify }
    return listen
 }

  const notify = protocol({ from: name }, listen)

  function listen (message) {
    const { type, data } = message
    if (type === 'update') {
      input.value = data
    }
    fill.style.width = `${(data / max) * 100}%`
    input.focus()
  }

  const el = document.createElement('div')
  el.classList.add('container')
  const shadow = el.attachShadow({ mode: 'closed' })

  const input = document.createElement('input')
  input.type = 'range'
  input.min = min
  input.max = max
  input.value = min

  input.oninput = handle_input
  const bar = document.createElement('div')
  bar.classList.add('bar')

  const ruler = document.createElement('div')
  ruler.classList.add('ruler')

  const fill = document.createElement('div')
  fill.classList.add('fill')

  bar.append(ruler, fill)
  const style = document.createElement('style')
  // style.textContent = get_theme()

  shadow.append(style, input, bar)
  
  function inject (data) {
    console.log('Injecting style:', data)
    const sheet = new CSSStyleSheet()
    sheet.replaceSync(data)
    shadow.adoptedStyleSheets = [sheet]
  }

  await sdb.watch(onbatch)

  return el

  // handler
  function handle_input (e) {
    const val = Number(e.target.value)
    fill.style.width = `${(val / max) * 100}%`
    notify({ from: name, type: 'update', data: val })
  }

  function onbatch (batch) {
     for (const { type, data } of batch) {
       on[type] && on[type](data)
     }
    }
}

// ============ Fallback Setup for STATE ============

// This fallback_module function is required for STATE initialization
function fallback_module () {
  return {
    drive: {},
    api: fallback_instance,// Used to customize API (like styles or icons)
  }

  function fallback_instance(opts) {
  console.log('make instance:', opts);
  return {
    drive: {
      'style/': {
        'theme.css': {
          raw: `
            :host {
              box-sizing: border-box;
              --white       : hsla(0, 0%, 100%, 1);
              --transparent : hsla(0, 0%, 0%, 0);
              --grey        : hsla(0, 0%, 90%, 1);
              --blue        : hsla(207, 88%, 66%, 1);
              position: relative;
              width: 100%;
              height: 16px;
            }

            *, *::before, *::after {
              box-sizing: inherit;
            }

            input {
              position: absolute;
              top: 0;
              left: 0;
              width: 100%;
              -webkit-appearance: none;
              outline: none;
              margin: 0;
              z-index: 2;
              background-color: var(--transparent);
            }

            .bar {
              position: absolute;
              top: 3px;
              left: 0;
              z-index: 0;
              height: 10px;
              width: 100%;
              border-radius: 8px;
              overflow: hidden;
              background-color: var(--grey);
              display: flex;
              flex-direction: column;
              justify-content: center;
            }

            .ruler {
              position: absolute;
              height: 6px;
              width: 100%;
              transform: scale(-1, 1);
              background-size: 20px 8px;
              background-image: repeating-linear-gradient(
                to right,
                var(--grey) 0px,
                var(--grey) 17px,
                var(--white) 17px,
                var(--white) 20px
              );
            }

            .fill {
              position: absolute;
              height: 100%;
              width: 0%;
              background-color: var(--grey);
            }

            input:focus + .bar .fill,
            input:focus-within + .bar .fill,
            input:active + .bar .fill {
              background-color: var(--blue);
            }

            input::-webkit-slider-thumb {
              -webkit-appearance: none;
              width: 16px;
              height: 16px;
              border-radius: 50%;
              background-color: var(--white);
              border: 1px solid var(--grey);
              cursor: pointer;
              box-shadow: 0 3px 6px rgba(0, 0, 0, 0.4);
              transition: background-color 0.3s, box-shadow 0.15s linear;
            }

            input::-webkit-slider-thumb:hover {
              box-shadow: 0 0 0 14px rgba(94, 176, 245, 0.8);
            }

            input::-moz-range-thumb {
              width: 16px;
              height: 16px;
              border-radius: 50%;
              background-color: var(--white);
              border: 1px solid var(--grey);
              cursor: pointer;
              box-shadow: 0 3px 6px rgba(0, 0, 0, 0.4);
              transition: background-color 0.3s, box-shadow 0.15s linear;
            }

            input::-moz-range-thumb:hover {
              box-shadow: 0 0 0 14px rgba(94, 176, 245, 0.8);
            }
          `
        }
      },

      'data/': {
        'opts.json': {
          raw: opts
        }
      }
    }
  };
 }
}


*/
}).call(this)}).call(this,"/src/index.js")
},{"STATE":2}],2:[function(require,module,exports){

},{}],3:[function(require,module,exports){
const prefix = 'https://raw.githubusercontent.com/alyhxn/playproject/main/'
const init_url = prefix + 'src/node_modules/init.js'

fetch(init_url, { cache: 'no-store' }).then(res => res.text()).then(async source => {
  const module = { exports: {} }
  const f = new Function('module', 'require', source)
  f(module, require)
  const init = module.exports
  await init(arguments, prefix)
  require('./page') // or whatever is otherwise the main entry of our project
})

},{"./page":4}],4:[function(require,module,exports){
(function (__filename){(function (){
// page.js
const STATE = require('../src/node_modules/STATE')
const statedb = STATE(__filename)
const { sdb, get } = statedb(fallback_module)

const range_slider = require('..')
const style = document.createElement('style')
document.body.append(style)

// Watch handlers
const on = {
  value: handleValue,
  style: inject
}

// Batch event dispatcher
function onbatch(batch) {
  console.log('📦 Watch triggered with batch:', batch)
  for (const { type, data } of batch) {
    if (on[type]) {
      on[type](data)
    }
  }
}

// Handle value updates
function handleValue(data) {
  console.log(`✅ SID "${data.id}" value is now:`, data.value)
}

// Inject CSS into <style> tag
function inject(data) {
  console.log('Injecting CSS:', data)
  if (data?.raw) {
    style.textContent = data.raw
  }
}

async function main () {
  const subs = await sdb.watch(onbatch)
  const range = await range_slider(subs[0])

  // Create DOM elements
  const header = document.createElement('h1')
  header.textContent = 'range slider'

  const main = document.createElement('div')
  main.classList.add('demo')
  main.append(range)

  // Append elements to the body
  document.body.append(header, main)

  // Get and inject the CSS
  const css = await sdb.drive.get('style/theme.css')
  inject(css)

}
main()

function fallback_module() {
  return {
    drive: {
        'style/': {
           'theme.css': {
              raw: `
               .demo {
                 padding: 50px
                }`
            }
       }
    },
    _: {
     '..': {    
        $:'' ,
        0: { value: { min: 0, max: 10 }  },
        mapping: {
          style: 'style',
          data: 'data'
        }    
      }
    }
  };
}

}).call(this)}).call(this,"/web/page.js")
},{"..":1,"../src/node_modules/STATE":2}]},{},[3]);
