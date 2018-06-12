/* global QUnit, MCMC */
QUnit.module("MCMC", function() {
    
    let twoPi = Math.PI * 2;
    
    var normal = function(x, mean, stdv) {
        let variance = stdv * stdv;
        let c = 1 / Math.sqrt(twoPi * variance);
        let twoV = 2*variance;
        let a = (x - mean) * (x - mean);
        let e = a / twoV;
        return c * Math.exp(-e); 
    };
    
    var getRandomGenerator = function(seed) {
        return function() {
            seed = Math.sin(seed) * 10000; 
            return seed - Math.floor(seed);
        };
    };
    
    var create = function() {
        var options = {};
        var seed = 12345;
        
        options.random = getRandomGenerator(seed);
        
        // pick a starting values for the parameters
        options.initParams = function() {
            return options.random() * 20;
        }
        
        // specify a function that proposes new parameters
        options.proposeParams = function(x) {
            var move = (this.random() * 2 - 1) * 2;
            return x += move;
        }
        
        // specify a function that evaluates the parameters
        options.evalParams = function(x) {
            return normal(x, 10, 2);
        };
        
        return MCMC.create(options);
    };
    
    QUnit.test("Create", function( assert ) {
        var mcmc = create();
        assert.notStrictEqual(mcmc, undefined, "MCMC object must exist.");
        assert.equal(mcmc.iteration, 0, "'iteration' must be initialized to 0.");
        assert.equal(mcmc.lastEval, 0.019201501767309476, "'lastEval' must be initialized.");
        assert.equal(mcmc.lastParams, 5.672708863785374, "'lastParams' must be initialized.");
        assert.notStrictEqual(mcmc.proposeParams, null, "'proposeParams' function must not be null");
        assert.notStrictEqual(mcmc.evalParams, null, "'evalParams' function must not be null.");
        assert.notStrictEqual(mcmc.proposeParams, undefined, "'proposeParams' function must not be undefined");
        assert.notStrictEqual(mcmc.evalParams, undefined, "'evalParams' function must not be undefined.");
    });
    
    QUnit.test("Run", function( assert ) {
        var mcmc = create();
        var sampleCount = 10000;
        var samples = new Array(sampleCount);
        var hasUndefined = false;
        for (let i=0; i<sampleCount; i++) {
            samples[i] = mcmc.next();
            if (samples[i] === undefined) {
                hasUndefined = true;
            }
        }
        assert.ok(!hasUndefined, "All samples must not be undefined");
        assert.equal(mcmc.iteration, sampleCount, "Iteration muxst equal the sample count when complete.");
        assert.equal(samples.length, sampleCount, "Array of samples muxst equal the sample count when complete.");
        assert.equal(samples[0], 6.069135122426815);
        assert.equal(samples[9999], 9.487058933623182);
        assert.equal(mcmc.accepted, 8065);
        assert.equal(mcmc.rejected, 1935);
        console.log(samples);
        var textArea = document.getElementById("text-out");
        textArea.value = samples.map(function(x) {
            return x.toString();
        }).join('\n');
    }); 
    /*
    QUnit.test("TODO", function( assert ) {
        var actual = 0;
        var expected = 1;
        assert.equal(actual, expected, "message");
    }); 
    */

});
