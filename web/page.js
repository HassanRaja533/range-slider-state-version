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
