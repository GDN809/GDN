// ******* read MNIST labels & dots ******
//
var dr09 = [],draw
function getRandom0_9() {
  var Num,tNum; mt = new MersenneTwister();
  for ( var k=0; k<10; k++ ) {
   		//do { drow = Math.floor(Math.random()*10000); Num = ldata[drow]; }
   do { drow = Math.floor( mt.nextInt(0,10000) ); Num = ldata[drow]; }
   while ( Num != k );
   dr09[k] = drow;
   
  }; 
}
//
function getImgRnd(n) {
  var Num,tNum = 0;
  var mt = new MersenneTwister();
   		//do { tNum = Math.floor(Math.random()*10000); Num = ldata[tNum]; }
   do { tNum = mt.nextInt(0,10000); Num = ldata[tNum]; }
   while ( Num != n );
		for( var x=0; x<28; x++) { 
      		for(var y=0; y<28; y++) {  img[n][x][y] = Math.floor( idata[ tNum ][x*28 + y] );
      		} ; 
		}; 
	return tNum
}
function getImgNo(c,no) {	// c:char no:imagedata No
	for( var x=0; x<28; x++) { 
      		for(var y=0; y<28; y++) {  img[c][x][y] = Math.floor( idata[ no ][x*28 + y] );
      		} ; 
		}; 
}

//---------------- load 0-9 base data ---------------------
var img = []
function load09(k) { 	// k:0..9		//getRandom09();
	img[k] = new Array(); //console.log( k,idata[ dr09[k] ])
 	 for(var i=0; i<28; i++) { img[k][i] = new Array()
      		for(var j=0; j<28; j++) {  img[k][i][j] = Math.floor(idata[ dr09[k] ][j*28 + i]);
      		} ; 	//console.log( img )
  	 }; 
}	 
	 
//---------------- read bin file ( https://qiita.com/kinmojr/items/4c7a003aa19f8dcf4c4f ) ---------------
var idata = [];			// ***** Image data array *****
function handleImageFiles(files) { 
    if (window.FileReader) {   getAsBin(files[0]); 
      } else {	alert('FileReader are not supported in this browser.'); }
	 //document.getElementById("Tr09").disabled = false; 
    }

    function getAsBin(fileToRead) {
      var reader = new FileReader();	 // Read file into memory as UTF-8      
      reader.readAsArrayBuffer(fileToRead);     // Handle errors load
      reader.onload = loadImgHandler;
      reader.onerror = errorHandler;
    }
    function loadImgHandler(event) {
      var fbin = event.target.result;
      processImgData(fbin);
    }
    function processImgData(bin) { 
       var dataView = new DataView(bin);
       	var number_of_images = dataView.getInt32(4);
	var row = dataView.getUint32(8);
	var column = dataView.getUint32(12); //console.log(dataView.getInt8(16));
	var dlen = row*column;
	  for(var i=0; i<number_of_images; i++) {  idata[i] = [];
	    for(var j=0; j<dlen; j++) {  idata[i][j] = dataView.getUint8(16+i*dlen+j);
		 if (idata[i][j]==255) { idata[i][j]=254; }
	    }
	  }; //console.log(idata[0][0]);
	 getRandom0_9();
	 for( var k=0; k<10; k++) { load09(k);  };  // ++++++++++++++++++
	 //console.log( img )
	 
	 for ( var x=0; x<mtk; x++ ) {	 //h[x].x = x/2; h[x].y = x/2; 
			imgmt[x] = new  Array;	imgsp[x] = new Array;
			//mtw[x] = new Array; //mtwk[x] = new Array
			for ( var y=0; y<mtk; y++ ) {  imgmt[x][y] = new THREE.Vector3( x/2,y/2,0 );
					imgsp[x][y] = new Array;  //mtw[x][y] = 0 ; //mtwk[x][y] = 0 ;
					imgsp[x][y] = sphereVec(  imgmt[x][y], 0.05, "rgb(255,255,255)" ); } }
 }
//    function errorHandler(evt) {
//      if(evt.target.error.name == "NotReadableError") { alert("Canno't read file !"); }
//    }

//---------------- read bin file ( https://qiita.com/kinmojr/items/4c7a003aa19f8dcf4c4f ) ---------------
var ldata = [];			// ***** Label data array *****
function handleLabelsFiles(files) {
    if (window.FileReader) {   getAsText(files[0]);	//getRandom0_9()
      } else {			 alert('FileReader are not supported in this browser.'); }
	//getRandom0_9(); //document.getElementById("btn0").disabled = false;
 }

    function getAsText(fileToRead) { 
      var reader = new FileReader();	 // Read file into memory as UTF-8      
      reader.readAsArrayBuffer(fileToRead);     // Handle errors load
      reader.onload = loadHandler;
      reader.onerror = errorHandler;
    }
    function loadHandler(event) {
      var fbin = event.target.result;
      processData(fbin);
    }
    function processData(bin) {
       var dataView = new DataView(bin);
       	var number_of_labels = dataView.getInt32(4); 
	  for(var i=0; i<number_of_labels; i++) { ldata[i] = dataView.getInt8(8+i); }
	  //console.log(ldata[0]);		ok
    }
    function errorHandler(evt) {
      if(evt.target.error.name == "NotReadableError") { alert("Canno't read file !"); }
	
    }