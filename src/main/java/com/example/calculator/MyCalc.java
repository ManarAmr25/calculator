package com.example.calculator;

import org.springframework.web.bind.annotation.*;

@CrossOrigin
@RestController
@RequestMapping("/app")
public class MyCalc {
    private double accum = 0;
    private double temp = 0;
    private String currentOperation = "add";

    @GetMapping("/ga")
    public double getAccum() {
        return this.accum;
    }

    @GetMapping("/sa")
    public String setAccum(@RequestParam(value = "accum", defaultValue = "0") String x) {
        this.accum= Double.parseDouble(x);
        return "first operand set to " + x;
    }

    @GetMapping("/gt")
    public double getTemp() {
        return this.temp;
    }

    @GetMapping("/st")
    public String  setSecondOperand(@RequestParam(value = "temp", defaultValue = "1") String x) {
        this.temp = Double.parseDouble(x);
        return "second operand set to " + x;
    }

    @GetMapping("/go")
    public String getCurrentOperation() {
        return currentOperation;
    }

    @GetMapping("/so")
    public String setCurrentOperation(@RequestParam(value = "op", defaultValue = "add") String currentOperation) {
        this.currentOperation = currentOperation;
        return "operation set to " + this.currentOperation;
    }

    @GetMapping("/calcunary")
    public String doUnaryOperation(@RequestParam(value = "operation") String operation ,@RequestParam(value = "operand") String operand){
        double result = Double.parseDouble(operand);
        if(operation.equals("sq")){
            result = sq(result);
        }else if (operation.equals("sqrt")){
            try{
                result = sqrt(result);
            }catch (ArithmeticException e) {
                return "E";
            }
        }else if(operation.equals("inverse")){
            try{
                result = inverse(result);
            }catch (ArithmeticException e) {
                return "E";
            }
        }else if(operation.equals("negate")){
            result = negate(result);
        }else if(operation.equals("percent1")){
            result = calcPercent_1(result);
        }else if(operation.equals("percent2")){
            result = calcPercent_2(result);
        }
        return Double.toString(result);
    }

    @GetMapping("/calcbinary")
    public String doBinaryOperation(@RequestParam(value = "operation", defaultValue = "add") String operation, @RequestParam(value = "operand", defaultValue = "0") String operand){
        Double x = Double.parseDouble(operand);
        if(operation.equals("add")){
            this.accum = add(this.accum,x);
            //this.secondOperand = result;
            System.out.println(this.accum);
            return Double.toString(this.accum);
        }else if(operation.equals("subtract")){
            this.accum = subtract(this.accum,x);
            //this.secondOperand = result;
            System.out.println(this.accum);
            return Double.toString(this.accum);
        }else if (operation.equals("multiply")){
            this.accum = multiply(this.accum,x);
            //this.secondOperand = result;
            System.out.println(this.accum);
            return Double.toString(this.accum);
        }else if (operation.equals("divide")){
            try {
                this.accum = divide(this.accum,x);
                //this.secondOperand = result;
                System.out.println(this.accum);
                return Double.toString(this.accum);
            }catch (ArithmeticException e) {
                return "E";
            }
        }
        return "E";
    }

    @GetMapping("/clear")
    public String clear(){
        this.accum = 0;
        this.accum = 0;
        this.currentOperation = "add";
        return "all cleared";
    }

    @GetMapping("/result")
    public String displayResult(){
        return Double.toString(this.accum);
    }

    public double add(double x, double y){
        System.out.println("x = " + x + "y = " + y);
        System.out.println(x+y);
        return x + y;
    }

    public double subtract(double x, double y){
        return x - y;
    }

    public double multiply(double x, double y){
        return x * y;
    }

    public double divide(double x, double y){
        if(y == 0){
            throw new ArithmeticException("division by zero is not allowed");
        }
        return x / y;
    }

    public double sq(double x){
        return x * x;
    }

    public double sqrt(double x){
        if (x < 0){
            throw new ArithmeticException("square root of negative number");
        }
        return Math.sqrt(x);
    }

    public double negate(double x){
        if(x == 0){
            return 0;
        }
        return -1 * x;
    }

    public double inverse(double x){
        if (x == 0){
            throw new ArithmeticException("division by zero");
        }
        return 1/x;
    }

    public double calcPercent_1(double x){
        return this.accum * x / 100;
    }

    public double calcPercent_2(double x){
        return x/100;
    }
}
