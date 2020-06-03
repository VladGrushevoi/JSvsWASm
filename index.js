(function () {


    function factorial(n) {
        return (n !== 1) ? n * factorial(n - 1) : 1;
    }

     function calc({instance, memory}){
        const jsRes = document.getElementById("jsResult");
        const jsTime = document.getElementById("jsTime");

         const wasmRes = document.getElementById("wasmResult");
         const wasmTime = document.getElementById("wasmTime");

         const result = document.getElementById("result");

         var TimeJS = performance.now();
         jsRes.innerHTML = "RESULT =" + factorial(10);
         TimeJS = performance.now()-TimeJS;
         jsTime.innerHTML = "TIME = " + TimeJS.toString();

         var TimeWasm = performance.now();
         wasmRes.innerHTML = "RESULT = " + instance.exports.factorial(10);
         TimeWasm = performance.now() - TimeWasm;
         wasmTime.innerHTML = "TIME = " + TimeWasm.toString();

         resultCalc.innerHTML = "WASM FASTERS ON " + (TimeJS/TimeWasm).toString();
    }

        async function initWasmModule(){
            let memory = new WebAssembly.Memory({initial: 1});

            const imports = {
                env: {
                    memory,
                    abort: function () {
                        throw new Error('Some error')
                    }
                }
            };

            const {instance} = await  WebAssembly.instantiate(
                await fetch("./build/optimized.wasm").then(r => r.arrayBuffer()),
                imports
            );

            if(instance.exports.memory){
                memory = instance.exports.memory;
            }

            return {
                instance,
                memory
            }
        }
        initWasmModule().then(calc)
 })();
