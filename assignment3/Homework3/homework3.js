var arr1=[1,2,3,4,5];
var result=[];

var sum=0;

function exercise1(arr1){
   //var str=document.getElementById('input-array').value;
    //var temp1=arr1.split(" ");
      //alert(temp1);     
     for(var i = 0; i < arr1.length; i++) {
    result[i] = parseInt(temp1[i]);
    }           
     for(var i=0;i<arr1.length;i++) {
             sum = sum + result[i];
     }    
    
   var avg=(sum/n);   
   document.getElementById('ans1').innerHTML=avg.toString(); 
     
}

/*function exercise2(){
    var largest=Math.max.apply(Math,array);
    window.alert("The largest number is:  " + largest);    
}

function exercise3(){
    for(i=0;i<n;i++){
        if(array[i]%2===0){
             window.alert("The status is true");
            return true;
        }      
    }
    window.alert("status is false");           
}

function exercise4(){
      for(i=0;i<n;i++){
        if(array[i]%2===0){
             window.alert("The status is true");
            return true;
        }      
    }
    
}*/