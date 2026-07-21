////////////////////////////////////////////////////////////////////
// initGrModules
////////////////////////////////////////////////////////////////////
window.addEventListener("load", function () {
	threeStart();
});

function threeStart() {
	initThree(); 
	initLight(); 
	initCamera(); 
	initAxis();
	loop(); 
}
////////////////////////////////////////////////////////////////////
// Init Three.js
////////////////////////////////////////////////////////////////////
var renderer,    
    scene,      
    canvasFrame;

function initThree() {
	canvasFrame = document.getElementById('canvas-frame');
	renderer = new THREE.WebGLRenderer({ antialias: true });
	renderer.setSize(canvasFrame.clientWidth, canvasFrame.clientHeight);
	canvasFrame.appendChild(renderer.domElement);
	renderer.setClearColor(0xEEEEEE, 1.0);
	scene = new THREE.Scene();
}

var camera, controls;
function initCamera() {
	camera = new THREE.PerspectiveCamera(45, canvasFrame.clientWidth / canvasFrame.clientHeight, 1, 10000);
		camera.position.set( 10, 10, 4 );	// set(5, 5, 2)
	camera.up.set(0, 0, 1);

	trackball = new THREE.OrbitControls(camera, canvasFrame);
	trackball.target.set(0, 2, 0); //
		trackball.target.set( 0, 0, -4);   // <--camera.lookAt({ x: 0, y: 10, z: 0 }); カメラの中心位置ベクトル
	trackball.update();
}
////////////////////////////////////////////////////////////////////
// Def Lights
////////////////////////////////////////////////////////////////////
var directionalLight, ambientLight;     
function initLight() {
	directionalLight = new THREE.DirectionalLight(0xDDDDDD, 1.0, 0);
	directionalLight.position.set(50, 0, 50);
	    scene.add(directionalLight);
	ambientLight = new THREE.AmbientLight(0x333333);
	  scene.add(ambientLight);
}
////////////////////////////////////////////////////////////////////
// Init Objects
////////////////////////////////////////////////////////////////////

var Daxis; 
var geometry, material, mesh, geometryL,geometryR, dx,dy,dz;
var sph=[], sphAX=[], matAX=[],sphCX=[], CX_y=[], sphGR=[], matGR=[], snpGR=[], snpPL=[], cylinder=[], 
	linematR=[], linematL=[], linematP=[],
	cldL=[],cldR=[], ldLmat=[], ldRmat=[],  cleL=[],cleR=[], leLmat=[], leRmat=[] ;
var sxl,sxr, syl,syr, szl,szr, xm,ym,zm, mz, lk,gmGR=new Array(), gmPL=new Array(), ptG=[], ptP=[], pt;

var LDL=new Array(); 
  for ( var x=0; x<102; x++ ) { LDL[x]= new Array(102).fill(0) ; }; 

function initAxis() {
	Daxis = new THREE.AxesHelper(15);
	scene.add(Daxis);			
	Daxis.position.set(0, 0, 0);
}

function clcolor( c,k,val, lr ) {		// k:0--19 LD No : lr:left=-1, right=1
	if ( lr==1 ) {  cldR[c][k].material.color.setHSL(val, 1.0, 0.5 ); } 
	else { 	       cldL[c][k].material.color.setHSL(val, 1.0, 0.5 ); }
}

  var cl=-1,cr=-1;
function lvlmap() {		// ---- DL heat map ----
 var hue,dmax=0, dmx=0,dmy=0, ddx, ddy, ddz, hx,hy,hz, u,ux,uy,uz, gn;
  for ( var x= 0; x<100; x++ ) { 
    for ( var y=0; y<100; y++) { 	hue = LDL[x][y];
      				if ( hue>dmax ) { dmax = hue; dmx=x; dmy=y; } }  }
  for ( var x= 0; x<100; x++ ) { 
    for ( var y=0;y<100; y++) { hue = LDL[x][y]/dmax; 		//if (hue==0 ) {console.log(x,y);}
		if ( hue>0) { dot( x/10-5, y/10, dp, hue) }
  } }; 

	for ( var c=0; c<4; c++ ) { if ( cell[c].isActive==1 && cell[c+1].isActive==1 ) { gn = c+5; dp=4;  } }
	for ( var c=0; c<3; c++ ) { if ( cell[c].isActive==1 && cell[c+2].isActive==1 ) { gn = c+9; dp=3;  } }
	for ( var c=0; c<2; c++ ) { if ( cell[c].isActive==1 && cell[c+3].isActive==1 ) { gn = c+12; dp=2;  } }
	if ( cell[0].isActive==1 && cell[4].isActive==1 ) { gn = 14; dp=1;  } 
	  sphGR[gn].position.z=dp; scene.add( sphGR[gn] ); cell[gn].isActive=1; cell[gn].fire=gtime+0.5 
	 // cl=-1;cr=-1;

	sphGR[gn].position.x=dmx/10-5; sphGR[gn].position.y=dmy/10; sphGR[gn].position.z=dp;
	for ( var c=0; c<5; c++ ) {		// --- GR->LD ---
	  if ( cell[c].isActive>0 ) { 	ddx = dx; ddy = dy; ddz = dz	
		if( cylinder[c][0].position.y>sphGR[gn].position.y ) { ddx=-dx;ddy=-dy }
		var p = new THREE.Vector3(	cylinder[c][0].position.x, cylinder[c][0].position.y, cylinder[c][7-c].position.z/4+4 )
		var q = new THREE.Vector3(	sphGR[gn].position.x, sphGR[gn].position.y, sphGR[gn].position.z )
		var d = new THREE.Vector3( ddx,ddy,ddz )
		var h  = new THREE.Vector3;
		 pdqH( p,d, q, h); lineTo( q.x, q.y, q.z, h.x, h.y, h.z, 1.0 );	
	    }
	  } 
}

function dot(x,y,z, r, col) {			// *** draw dot : col = HSLcolor ***
  var ptD = [], dotGeometry, dotMaterial, dots;
	ptD.push( new THREE.Vector3( x, y, z) );
	dotGeometry = new THREE.BufferGeometry().setFromPoints( ptD ); //console.log(dotGeometry)
	//dotGeometry = dgm.setFromPoints( ptD )
	dotMaterial = new THREE.PointsMaterial( { size:r, sizeAttenuation: false } );
	  dotMaterial.color.setHSL(col, 1.0, 0.3 ); 
	dots = new THREE.Points( dotGeometry, dotMaterial ); //dots.material.visible=false
	scene.add( dots ); 
	return dots
}
function dotVectors( V, r, col,op ) {			// *** draw dot : col = HSLcolor / opacity ***
  var ptD = [], dotGeometry, dotMaterial, dots, hsl;
	ptD.push( new THREE.Vector3( V.x, V.y, V.z ) );
	dotGeometry = new THREE.BufferGeometry().setFromPoints( ptD );
	//dotGeometry = dgm.setFromPoints( ptD );
	dotMaterial = new THREE.PointsMaterial( { size:r, sizeAttenuation: false } );
		//if ( !tr ) { tr = 0.3 }; 				 
		dotMaterial.transparent=true;  
		dotMaterial.opacity = op;
	  dotMaterial.color.setHSL(col, 1.0, 0.3 );
	dots = new THREE.Points( dotGeometry, dotMaterial );	//dots.visible=false
	scene.add( dots ); 
	return dots
}

function sphere( x,y,z, r, col ) {
  var gm, mat, sph;
    gm = new THREE.SphereGeometry(r, 30, 30);
	mat = new THREE.MeshPhongMaterial( {color: col} ); //mat.color =  col ;	// ({color: 0xffff00});
	sph = new THREE.Mesh(gm, mat);
	  sph.position.x=x; sph.position.y=y; sph.position.z=z; 
	scene.add( sph );
	return sph
}
function sphereVec( S, r, col ) {
  var gm, mat, sph;
    gm = new THREE.SphereGeometry(r, 30, 30);
	mat = new THREE.MeshPhongMaterial( {color: col} ); //mat.color =  col ;	// ({color: 0xffff00});
	sph = new THREE.Mesh(gm, mat);
	  sph.position.x=S.x; sph.position.y=S.y; sph.position.z=S.z; 
	scene.add( sph );
	return sph
}
var linemat = new Array; //THREE.LineBasicMaterial;
  for ( let l=0; l<11; l++ ) { 
	linemat[l] = new THREE.LineBasicMaterial()	//({ vertexColors: true }); 
	linemat[l].color.setHSL( l/10, 0.3, 0.5 ) }
	
function lineTo( sx,sy,sz, ex,ey,ez, col ) {	// *** lineTo : col = HSLcolor or Hex ***
  var gm, mat, pts=[],ln,lm=new Array(), cl;
	pts.push( new THREE.Vector3( sx,sy,sz ) )
	pts.push( new THREE.Vector3( (sx+ex)/2, (sy+ey)/2, (sz+ez)/2 ) )
	pts.push( new THREE.Vector3( ex,ey,ez ) )
	gm = new THREE.BufferGeometry().setFromPoints( pts );
		cl= new Array(1,1,1)
		gm.setAttribute('color',new THREE.BufferAttribute(new Float32Array(cl),3 ));
		//gm.setAttribute('needsUpdate',0 )
		gm.attributes.color.needsUpdate = true
		lm[col] = new THREE.LineBasicMaterial()	//({ vertexColors: true });
		//lm[col].color.r=col;	lm[col].color.g=1.0; lm[col].color.b=1.0	//setHSL( 0,5, 0.5, 1.0 )
		lm[col].color.setHSL( col, 0.3, 0.5 )
	//ln = new THREE.Line(gm, linemat[col*10]); //ln.visible = false;
		ln = new THREE.Line(gm, lm[col]);
	scene.add(ln);
  return ln; //linemat
}

 var  mapW=100, mapH=100, sprite;		// *** Cortex HeatMap : width,height of heat map ***
 var crlevel= new Array( mapW);
  for( var y=0; y<mapW; y++ ) { crlevel[y]=new Array( mapW ) }
		
function mapEL() {			
  var hue,dmax,x2,y2,z2,cy,cz, ly,lz, cl;
  var cy=new Array;
    for( var y=0; y<mapW; y++ ) { crlevel[y].fill(0) }
	dmax=0; cl=0;
	for(var i=0; i<numMT; i++) { 
   	  if ( cell[i].isActive>0 ) { cl = cl+Math.pow(2,i); 
		for( var y=0; y<mapW; y++ ) {
	  	  for( var z=0; z<mapH; z++ ) { hue=crlevel[y][z];				
			cy[i]=i*2; y2=cy[i]; z2=0; 
			d=Math.sqrt( (y/10-y2)*(y/10-y2)+(z/10-z2)*(z/10-z2) ); 
			hue = hue+Math.exp(-d/10)/2; crlevel[y][z]=hue; 
			if ( hue>dmax ) { dmax=hue }; }
		};   
	  };
              }; 
	for( var y=0; y<mapW; y++ ) {
	  for( var z=0; z<mapH; z++ ) { crlevel[y][z] = crlevel[y][z]/dmax; 
	} }	// heat map //

	for ( var i=0; i<numMT; i++ ) {  
	  if ( cell[i].isActive>0 ) { cy[i]=i*20; ly=cy[i]; lz=0;
	    for ( var z=0; z<mapH; z++ ) {  y2=cy[i]; dmax=0; 
		for( var y=cy[i]-5; y<cy[i]+5; y++) { 
		   if ( y>0 && y<90 ) { if ( crlevel[y][z]>=dmax ) { dmax=crlevel[y][z]; y2=y; } }
		}; 
		if(dmax>0.6) {lineTo( 0.2, ly/10, -lz/10-0.5,  0.2, y2/10, -z/10-0.5, cl/31 ); cy[i]=y2; ly=y2; lz=z; } 
	    }
	  }
	};  
	sprite = makeTextSprite(cl); sprite.position.set( 0.5,y2/10,-lz/10 ); sprite.material.opacity=1.0; scene.add( sprite );

}

function makeTextSprite(message, opts) {		// *** Sprite Text ***
    var parameters = opts || {};
    var fontface = parameters.fontface || 'Helvetica';
    var fontsize = parameters.fontsize || 12;
    var canvas = document.createElement('canvas');
    var context = canvas.getContext('2d');
    context.font = fontsize + "px " + fontface;

    // get size data (height depends only on font size)
    var metrics = context.measureText(message);
    var textWidth = metrics.width;

    // text color
    context.fillStyle = 'rgba(0, 0, 0, 1.0)';
    context.fillText(message, 0, fontsize);

    // canvas contents will be used for a texture
    var texture = new THREE.Texture(canvas)
    texture.minFilter = THREE.LinearFilter;
    texture.needsUpdate = true;

    var spriteMaterial = new THREE.SpriteMaterial({ map: texture });
    var sprite = new THREE.Sprite( spriteMaterial );
    sprite.scale.set( 10, 5, 1.0 );
    sprite.center.set( 0,1 );
    return sprite;
}

////////////////////////////////////////////////////////////////////
// Definition of loop function
////////////////////////////////////////////////////////////////////
var step = 0; //ステップ数
var initFlag = true, animID;
function loop() {
	renderer.render(scene, camera);
	requestAnimationFrame(loop);
}
