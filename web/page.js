// page.js
const STATE = require('../src/node_modules/STATE')
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
