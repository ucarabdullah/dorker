export namespace main {
	
	export class Result {
	    title: string;
	    result: string;
	
	    static createFrom(source: any = {}) {
	        return new Result(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.title = source["title"];
	        this.result = source["result"];
	    }
	}

}

