
var express = require('express');
var firebase = require('firebase');
var router = express.Router();
const auth = require('./middleware/auth');
const User = require('../models/user');
const Requisition = require('../models/requisition');
const Kit = require('../models/kit');
const Mycotoxin = require('../models/mycotoxin');
const Email = require('../models/email');
const Workmap=require('../models/Workmap');
const Sample=require('../models/sample');


router.get('/', (req, res) => {
 
  res.render('allsamples');
  
});




router.post('/',function(req,res,next){
  Kit.getActiveAfla().then((aflaArray)=>{
    if(aflaArray.length!=0){
         
      var aflaKit=aflaArray[0];
      var new_last;
      var last_filled=0;
      var counter=0;

      
      for(let i=aflaKit.toxinaStart;i<aflaKit.mapArray.length;i++) {
        Workmap.getOneMap(aflaKit.mapArray[i]).then((workmap)=>{
          counter++;
          if(workmap.samplesArray.length>0) {
            new_last=workmap.mapID;
            new_last=new_last.replace("_workmap", "");
            new_last=Number(new_last);
    
            if(new_last>last_filled){
              last_filled=new_last;
            }
    
            
          }
          if(counter==aflaKit.mapArray.length-1) {
            aflaKit.amount=aflaKit.stripLength-last_filled;
            aflaKit.toxinaStart=last_filled;
            aflaKit.calibrators.P1.absorbance=parseFloat(req.body.aflaCalibrator.P1);
            aflaKit.calibrators.P2.absorbance=parseFloat(req.body.aflaCalibrator.P2);
            aflaKit.calibrators.P3.absorbance=parseFloat(req.body.aflaCalibrator.P3);
            aflaKit.calibrators.P4.absorbance=parseFloat(req.body.aflaCalibrator.P4);
            aflaKit.calibrators.P5.absorbance=parseFloat(req.body.aflaCalibrator.P5);
            Kit.update(aflaKit._id,aflaKit).catch((err)=>{
              console.log(err);
            });
          }
          
        });
      } 
     }
  }).catch((error)=>{
    console.log(error);
  });

  Kit.getActiveDeox().then((deoxArray)=>{ 
    if(deoxArray.length!=0){
      var deoxKit=deoxArray[0];
      var new_last;
      var last_filled=0;
      var counter=0;
      
      for(let i=deoxKit.toxinaStart;i<deoxKit.mapArray.length;i++) {
        Workmap.getOneMap(deoxKit.mapArray[i]).then((workmap)=>{
          counter++;
          if(workmap.samplesArray.length>0) {
            new_last=workmap.mapID;
            new_last=new_last.replace("_workmap", "");
            new_last=Number(new_last);

            if(new_last>last_filled){
              last_filled=new_last;
            }

            
          }
          if(counter==deoxKit.mapArray.length-1) {
            
            deoxKit.amount=deoxKit.stripLength-last_filled;
            deoxKit.toxinaStart=last_filled;
            deoxKit.calibrators.P1.absorbance=parseFloat(req.body.donCalibrator.P1);
            deoxKit.calibrators.P2.absorbance=parseFloat(req.body.donCalibrator.P2);
            deoxKit.calibrators.P3.absorbance=parseFloat(req.body.donCalibrator.P3);
            deoxKit.calibrators.P4.absorbance=parseFloat(req.body.donCalibrator.P4);
            deoxKit.calibrators.P5.absorbance=parseFloat(req.body.donCalibrator.P5);
            Kit.update(deoxKit._id,deoxKit).catch((err)=>{
              console.log(err);
            });
          }
        });
      }
    }
  }).catch((error)=>{
    console.log(error);
  });

  Kit.getActiveT2().then((t2Array)=>{ 
    if(t2Array.length!=0){
      var t2Kit=t2Array[0];
      var new_last;
      var last_filled=0;
      var counter=0;
      
      for(let i=t2Kit.toxinaStart;i<t2Kit.mapArray.length;i++) {
        Workmap.getOneMap(t2Kit.mapArray[i]).then((workmap)=>{
          counter++;
          if(workmap.samplesArray.length>0) {
            new_last=workmap.mapID;
            new_last=new_last.replace("_workmap", "");
            new_last=Number(new_last);

            if(new_last>last_filled){
              last_filled=new_last;
            }

            
          }
          if(counter==t2Kit.mapArray.length-1) {
            t2Kit.amount=t2Kit.stripLength-last_filled;
            t2Kit.toxinaStart=last_filled;
            t2Kit.calibrators.P1.absorbance=parseFloat(req.body.t2Calibrator.P1);
            t2Kit.calibrators.P2.absorbance=parseFloat(req.body.t2Calibrator.P2);
            t2Kit.calibrators.P3.absorbance=parseFloat(req.body.t2Calibrator.P3);
            t2Kit.calibrators.P4.absorbance=parseFloat(req.body.t2Calibrator.P4);
            t2Kit.calibrators.P5.absorbance=parseFloat(req.body.t2Calibrator.P5);
            Kit.update(t2Kit._id,t2Kit).catch((err)=>{
              console.log(err);
            });
          }
        });
      }
    }
  }).catch((error)=>{
    console.log(error);
  });
 
  Kit.getActiveZea().then((zeaArray)=>{ 
    if(zeaArray.length!=0){
      var zeaKit=zeaArray[0];
      var new_last;
      var last_filled=0;
      var counter=0;
      
      for(let i=zeaKit.toxinaStart;i<zeaKit.mapArray.length;i++) {
        Workmap.getOneMap(zeaKit.mapArray[i]).then((workmap)=>{
          counter++;
          if(workmap.samplesArray.length>0) {
            new_last=workmap.mapID;
            new_last=new_last.replace("_workmap", "");
            new_last=Number(new_last);

            if(new_last>last_filled){
              last_filled=new_last;
            }
          }
          if(counter==zeaKit.mapArray.length-1) {
            zeaKit.calibrators.P1.absorbance=parseFloat(req.body.zeaCalibrator.P1);
            zeaKit.calibrators.P2.absorbance=parseFloat(req.body.zeaCalibrator.P2);
            zeaKit.calibrators.P3.absorbance=parseFloat(req.body.zeaCalibrator.P3);
            zeaKit.calibrators.P4.absorbance=parseFloat(req.body.zeaCalibrator.P4);
            zeaKit.calibrators.P5.absorbance=parseFloat(req.body.zeaCalibrator.P5);
            zeaKit.amount=zeaKit.stripLength-last_filled;
            zeaKit.toxinaStart=last_filled;
            Kit.update(zeaKit._id,zeaKit).catch((err)=>{
              console.log(err);
            });
          }
        });
      }
    }
  }).catch((error)=>{
    console.log(error);
  });

  Kit.getActiveFum().then((fumArray)=>{ 
    if(fumArray.length!=0){
      var fumKit=fumArray[0];
      var new_last;
      var last_filled=0;
      var counter=0;
      
      for(let i=fumKit.toxinaStart;i<fumKit.mapArray.length;i++) {

        Workmap.getOneMap(fumKit.mapArray[i]).then((workmap)=>{
          if(workmap.samplesArray.length>0) {
            new_last=workmap.mapID;
            new_last=new_last.replace("_workmap", "");
            new_last=Number(new_last);

            if(new_last>last_filled){
              last_filled=new_last;
            }
          }
          if(i==fumKit.mapArray.length-1) {
            fumKit.amount=fumKit.stripLength-last_filled;
            fumKit.toxinaStart=last_filled;
            fumKit.calibrators.P1.absorbance=parseFloat(req.body.fbCalibrator.P1);
            fumKit.calibrators.P2.absorbance=parseFloat(req.body.fbCalibrator.P2);
            fumKit.calibrators.P3.absorbance=parseFloat(req.body.fbCalibrator.P3);
            fumKit.calibrators.P4.absorbance=parseFloat(req.body.fbCalibrator.P4);
            fumKit.calibrators.P5.absorbance=parseFloat(req.body.fbCalibrator.P5);
            Kit.update(fumKit._id,fumKit).catch((err)=>{
              console.log(err);
            });
          }
        });
      }
    }
  }).catch((error)=>{
    console.log(error);
  });

  
  Kit.getActiveOcra().then((ocraArray)=>{ 
    if(ocraArray.length!=0){
      var ocraKit=ocraArray[0];
      var new_last;
      var last_filled=0;
      var counter=0;
      
      for(let i=ocraKit.toxinaStart;i<ocraKit.mapArray.length;i++) {
        Workmap.getOneMap(ocraKit.mapArray[i]).then((workmap)=>{
          counter++;
          if(workmap.samplesArray.length>0) {
            new_last=workmap.mapID;
            new_last=new_last.replace("_workmap", "");
            new_last=Number(new_last);

            if(new_last>last_filled){
              last_filled=new_last;
            }

            
          }
          if(counter==ocraKit.mapArray.length-1) {
            ocraKit.amount=ocraKit.stripLength-last_filled;
            ocraKit.toxinaStart=last_filled;
            ocraKit.calibrators.P1.absorbance=parseFloat(req.body.otaCalibrator.P1);
            ocraKit.calibrators.P2.absorbance=parseFloat(req.body.otaCalibrator.P2);
            ocraKit.calibrators.P3.absorbance=parseFloat(req.body.otaCalibrator.P3);
            ocraKit.calibrators.P4.absorbance=parseFloat(req.body.otaCalibrator.P4);
            ocraKit.calibrators.P5.absorbance=parseFloat(req.body.otaCalibrator.P5);
            Kit.update(ocraKit._id,ocraKit).catch((err)=>{
              console.log(err);
            });
          }
        });
      }
    }
  }).catch((error)=>{
    console.log(error);
  });
  
    res.redirect('/calibrationcurves');
});


module.exports = router;
