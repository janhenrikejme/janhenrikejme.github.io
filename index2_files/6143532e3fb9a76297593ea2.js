/** amedia.no - 6143532e3fb9a76297593ea2_20251029T0844 - Kilkaya AS - Copyright 2025 - Config:amediano */


(function () {

    var l="https://cl.k5a.io/6143532e3fb9a76297593ea2",d=document;
    if(d.head){

        var a = function(s,cb) {
            var c=d.createElement("script");c.type=("noModule"in c?"module":"");c.src=s+'.'+(c.type==''?'no':'')+'module.js';c.defer="defer";if(cb){c.onload = function(e){cb();};}d.getElementsByTagName('head')[0].appendChild(c);return c;
        }


        // a(l+'.streams');
        var antb = function() { a('https://cl-eu6.k5a.io/66b1ed92a1ff162faf4208f6');}
        var dntb = function() {
            if(typeof(k5aMeta)!=='undefined'&&typeof(k5aMeta['author'])!=='undefined'&&k5aMeta['author'].join().match(/^\s*ntb\s*$/i) !== null) {
                if(typeof(k5aNTB)==='undefined'){antb();}
                else {k5aNTB.pageview(k5aMeta,true);}
            }
            else {
                var f = ['article:author','k5a:author','og:author'];
                for(var i=0;i<f.length;i++) {
                    var s = kilkaya.pageData.getMetaField(f[i]);
                    if( s !== null && s.length>0) {
                        for(var x=0;x<s.length;x++) {
                            if(s[x].match(/^\s*ntb[\s\,\-]*$/i)!==null) {
                                antb();return;
                            }
                        }
                    }
                }
            }
            
        }
        if( location.href.match(/nettavisen\.no|h\-avis\.no|rb\.no|nationen\.no|ta\.no|ba\.no|tb\.no|f\-b\.no|oa\.no|budstikka\.no|sa\.no|tk\.no|ringblad\.no|glomdalen\.no|ostlendingen\.no|op\.no|ifinnmark\.no|ao\.no|jbl\.no|hadeland\.no|sandnesposten\.no|bygdeposten\.no|ringsaker\-blad\.no|lofotposten\.no|rastavanger\.no|krs\.no|k5a\.io/i) !== null) {
            a(l, dntb );
            document.addEventListener('K5A:SpaReady',function(e){dntb();});
        }
        else { a(l);}
    }

})();

