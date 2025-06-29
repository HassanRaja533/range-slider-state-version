(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){

},{}],2:[function(require,module,exports){
arguments[4][1][0].apply(exports,arguments)
},{"dup":1}],3:[function(require,module,exports){
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
const STATE = require('../src/node_modules/STATE.js')
const statedb = STATE(__filename)
const { sdb, get } = statedb(fallback_module)

const range_slider = require('..')


const on = {
  // This will handle all incoming value updates
  value: handleValue
}

// This is the core watch handler
function onbatch(batch) {
  console.log('📦 Watch triggered with batch:', batch)
  for (const { type, data } of batch) {
    if (on[type]) {
      on[type](data)
    }
  }
}

// Called when any input module sends a value update
function handleValue(data) {
  console.log(`✅ SID "${data.id}" value is now:`, data.value)
}

async function main () {
    const subs = await sdb.watch(onbatch)
const range = range_slider(subs[0])

document.body.innerHTML = '<h1> range slider </h1>'

const main = document.createElement('div')
main.classList.add('demo')

const style = document.createElement('style')
style.textContent = `
 .demo {
    padding: 50px;
 }
`

main.append(range)
document.body.append(main, style)
}
main()


function fallback_module() {
  return {
    drive: {
        'style/': {
           'theme.css': {
              raw: `
               .demo {
                 padding: 50px;
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
},{"..":1,"../src/node_modules/STATE.js":2}]},{},[3]);
