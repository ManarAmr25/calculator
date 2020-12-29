const app = Vue.createApp({
    data() {
        return {
            //properties and values
            expDis: '0',
            operandDis: '0',
            dots : 0,
            opAdded : false,
            operation : 'add',
            equalAdded : false,
            isError : false,
        }
    },
    methods: {
        //methods
        clearDisplay(){
            this.expDis = '0';
            this.operandDis = '0';
            this.dots = 0;
            this.opAdded = false;
            this.operation = 'add';
            this.equalAdded = false;
            this.isError = false;
            axios.get("http://localhost:8090/app/clear").then(response => {return response.data}).then(txt => {console.log(txt)});
        },
        deleteOne(){
            if(this.equalAdded || this.opAdded){
                return;
            }
            if(this.operandDis.length == 1 || (this.operandDis.length == 2 && this.operandDis.charAt(0) == '-')){
                this.operandDis = '0';
            }else{
                if(this.operandDis.charAt(this.operandDis.length-1) === '.'){
                    this.dots--;
                }
                this.operandDis = this.operandDis.substring(0,(this.operandDis.length)-1);
            }
        },
        concat(str){
            if(this.equalAdded || this.operandDis === 'E'){
                this.clearDisplay();
            }
            if(this.opAdded){
                this.operandDis = '0';
                this.opAdded = false;
            }
            if(str === '.'){
                if(this.dots == 0){ //no previous dots in the same number
                    //add a dot
                    this.operandDis += str;
                    this.dots ++;
                    this.opAdded = false;
                }
                //else : a dot is placed previously, do nothing
            }else{
                if(this.operandDis === '0'){
                    this.operandDis = str
                }else{
                    this.operandDis += str;
                }
                this.opAdded = false;
            }
        },
        isOperation(){
            if(this.expDis[this.expDis.length-1] === '+' ||
                this.expDis[this.expDis.length-1] === '-' ||
                this.expDis[this.expDis.length-1] === '÷' ||
                this.expDis[this.expDis.length-1] === '×'){
                return true;
            }
            return false;
        },
        getOperation(operation){
            if(operation === '÷'){
                return 'divide';
            }else if(operation === '-'){
                return 'subtract';
            }else if(operation === '×'){
                return 'multiply';
            }else if(operation === '+'){
                return 'add';
            }
            return '';
        },
        operate(operation){
            if(this.equalAdded && this.operandDis !== 'E'){
                var p = this.operandDis;
                this.clearDisplay();
                this.operandDis = p;
            }else if(this.operandDis === 'E'){
                return;
            }
            var op = this.operation;
            if(this.opAdded){ //overwrite the previous operation
                this.expDis = this.expDis.substring(0,this.expDis.length-1) + operation;
            }else{
                var x = this.operandDis;
                axios.get("http://localhost:8090/app/calcbinary",
                {params:{
                        operation:op,
                        operand:x
                        }
                }).then(response => {return response.data;})
                .then(txt => {
                    //console.log(txt); 
                    if(txt === 'E'){
                        this.isError = true;
                    }
                });


                if(this.operandDis[this.operandDis.length-1] === '.'){
                    this.operandDis = this.operandDis.substring(0,this.operandDis.length-1);
                }
                if(this.expDis === '0'){ //no expression yet
                    this.expDis = this.operandDis + operation;
                }else{
                    this.expDis += this.operandDis + operation;
                }
            }
            var O = this.getOperation(operation)
            this.operation = O;
            this.opAdded = true;
            this.equalAdded = false;
            this.dots = 0;
        },
        equal(){
            // display the result in the back end
           
            if(!this.equalAdded && this.operandDis !== 'E'){
                if(this.operandDis[this.operandDis.length-1] === '.'){
                    this.operandDis = this.operandDis.substring(0,this.operandDis.length-1);
                }
                if(this.expDis === '0'){ //no expression yet
                    this.expDis = this.operandDis + '=';
                }else{
                    this.expDis += this.operandDis + '=';
                }

                if(this.isError){
                    this.operandDis = 'E';
                    return;
                }

                var op = this.operation;
                var x = this.operandDis;
                axios.get("http://localhost:8090/app/calcbinary",
                {params:{
                    operation:op,
                    operand:x,
                }}).then(response => {return response.data})
                .then(txt => {
                    this. operandDis = txt.toString();
                    console.log(txt);
                });
                this.equalAdded = true;
            }
        },
        unary(operation){
            var op = operation;
            if(op === 'percent' && (this.expDis.charAt(this.expDis.length-1) === '+' || this.expDis.charAt(this.expDis.length-1) === '-') ){
                op += '1';
            }else if(op === 'percent' && (this.expDis.charAt(this.expDis.length-1) === '÷' || this.expDis.charAt(this.expDis.length-1) === '×') ){
                op += '2';
            }
            var x = this.operandDis;
            if(x !== 'E'){
                axios.get("http://localhost:8090/app/calcunary",
                {params:{
                    operation:op,
                    operand:x
                }}).then(response => {return response.data}).then(txt => {
                    this. operandDis = txt.toString();
                    console.log(txt);
                });
            }
        },
    }
})
