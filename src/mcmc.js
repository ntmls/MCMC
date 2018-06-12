
/* global exports */
(function(exports) {
    
    function MCMC(options) {
        this.iteration = 0;
        this.proposeParams = options.proposeParams;
        this.evalParams = options.evalParams;
        this.lastParams = options.initParams();
        this.lastEval = options.evalParams(this.lastParams);
        this.random = options.random;
        this.accepted = 0;
        this.rejected = 0;
    }
    
    MCMC.prototype.next = function() {
        this.iteration += 1;
        var params = this.proposeParams(this.lastParams);
        var currentEval = this.evalParams(params);
        var r1 = this.random();
        if (r1 < Math.min(1, currentEval / this.lastEval)) {
            // accept
            this.lastParams = params;
            this.lastEval = currentEval
            this.accepted += 1;
        } else {
            // rejectteamtea
            this.rejected += 1;
        }
        return this.lastParams;
    }
    
    var create = function(options) {
        return new MCMC(options); 
    };
    
    exports.MCMC = {
        "create": create
    };
    
})(typeof exports === 'undefined' ? this : exports);