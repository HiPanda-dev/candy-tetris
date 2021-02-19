
var admob = {
    registerBanner: function registerBanner() {
        if( /(android)/i.test(navigator.userAgent) ) {
          this.admobid = { // for Android
            banner: "ca-app-pub-1300730831141008/2250053815",
            interstitial: "ca-app-pub-1300730831141008/4345857822",
            rewardvideo: 'ca-app-pub-1300730831141008/3388001314',
          };
        } else if(/(ipod|iphone|ipad)/i.test(navigator.userAgent)) {
          this.admobid = { // for iOS
            banner: 'ca-app-pub-1300730831141008/1273823921',
            interstitial: 'ca-app-pub-1300730831141008/5021497245',
            rewardvideo: 'ca-app-pub-1300730831141008/1848538994',
          };
        }

    },

    showBanner: function showBanner() {
        if(AdMob) {
            AdMob.createBanner({
                adId: this.admobid.banner,
                position: AdMob.AD_POSITION.TOP_CENTER,
                autoShow: true,
                isTesting: false
            });
        }
    },

    showInterstitial : function showInterstitial() {
        if(AdMob) {
            AdMob.prepareInterstitial( {adId:this.admobid.interstitial, autoShow:true} );
            AdMob.showInterstitial();
        }
    }
}

var service;
var productIds;
if( /(android)/i.test(navigator.userAgent) ) {
    productIds = [
        "com.candy.tetris.removeads",
        "com.candy.tetris.item1",
        "com.candy.tetris.item2",
        "com.candy.tetris.item3",
        "com.candy.tetris.item4"
    ];
}
else if(/(ipod|iphone|ipad)/i.test(navigator.userAgent)) {
     productIds = [
        "RADS001",
        "BG001",
        "BG002",
        "BG003",
        "BG004"
    ];
}


function inappData(name, action) {
    this.name = name;
    this.leftDetail = null;
    this.rightDetail = null;
    this.action = action || null;
    this.setting = false;
    this.onCompletePurchases = null;
    this.currentProductId = null;
}

var inapp = {
    consume : function consume(productId) {
        service.consume(productId, 3, function(error) {
           console.log("consume: " + productId);
        });
    },

    buyProductItem1: function buyProductItem1(onComplete) {
        this.currentProductId = productIds[1];
        this.onCompletePurchases = onComplete;
        if(service){
            service.purchase(this.currentProductId);
        }else{
            console.log("error");
        }
    },

    buyProductItem2: function buyProductItem2(onComplete) {
        this.currentProductId = productIds[2];
        this.onCompletePurchases = onComplete;
        if(service){
            service.purchase(this.currentProductId);
        }else{
            console.log("error");
        }
    },

    buyProductItem3: function buyProductItem3(onComplete) {
        this.currentProductId = productIds[3];
        this.onCompletePurchases = onComplete;
        if(service){
            service.purchase(this.currentProductId);
        }else{
            console.log("error");
        }
        
    },

    buyProductItem4: function buyProductItem4(onComplete) {
        this.currentProductId = productIds[4];
        this.onCompletePurchases = onComplete;
        if(service){
           service.purchase(this.currentProductId);
        }else{
            console.log("error");
        }
    },

    removeads:function removeads(onComplete) {
        this.currentProductId = productIds[0];
        this.onCompletePurchases = onComplete;
        if(service){
            service.purchase(this.currentProductId);
        }
         //onComplete();
    },

    isRemoveAds:function isRemoveAds(argument) {
        var purchased = service.isPurchased(productIds[0]);
        return purchased;
    },

    onProductPurchaseStarted:function(product)
    {
        console.log("Starting product " + product.title + " purchase...");
        this.consume(this.currentProductId);
    },

    onProductPurchaseFailed:function(product, error)
    {
        console.log('onProductPurchaseFailed: ', product, error);
        this.consume(this.currentProductId);
    },

    onProductPurchaseCompleted:function(purchase)
    {
        if (purchase) console.log("product PURCHASED: "+ purchase.transactionId);
        this.onCompletePurchases();
        this.consume(this.currentProductId);
    },


    main: function main(productId) {
        var self = this;
        var ads = localStorage.getItem("removeAds1");  
        if(ads === "true"){
            //nothing
        }else{
            window.admob.registerBanner();
            window.admob.showBanner();
        }
       
        service = Cocoon.InApp;
        if(service){
            service.on("purchase", {
                start: function(productId) {
                    console.log("purchase started " + productId);
                     self.onProductPurchaseStarted(productId);
                },
                error: function(productId, error) {
                    console.log("purchase failed " + productId + " error: " + JSON.stringify(error));
                    self.onProductPurchaseFailed(error, self);
                },
                complete: function(purchase) {
                    console.log("purchase completed " + JSON.stringify(purchase));
                    self.onProductPurchaseCompleted(null);
                }
            });
            service.initialize({
                 autofinish:true
            }, function(error) {});
        }
       
    }
}


window.admob = admob; 
window.inapp = inapp;

document.addEventListener('deviceready', window.inapp.main, false);

 //window.inapp.main();