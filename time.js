class Time {
    timer = [];
    ready = false;

    constructor(data) {
        let timeValue = data.split(":");
        try {
            if (timeValue.length === 3) {
                for (let t of timeValue) {
                    let num = Number(t);
                    if (num === NaN) {
                        throw "Please add a valid number";
                    }else if(num > 99 || num < 0){
                        throw "Please add a number between 0 to 99 for each time value";
                    }
                    this.timer.push(parseInt(num));
                }
                this.ready = true;
            } else {
                throw "The entered value is not in the right format";
            }
        } catch (e) {
            alert(e);
            this.ready = false;
        }
    }

    getTimerValue() {
        return this.timer[0] * 3600 + this.timer[1] * 60 + this.timer[2];
    }
}
