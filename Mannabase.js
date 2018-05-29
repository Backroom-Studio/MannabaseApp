
//Called when application is started.
function OnStart()
{

//Set global variables load plugins etc...

 try {
    var fldr = app.GetPrivateFolder("manna");
    var showSwipe = app.ReadFile( fldr + "/setting.txt");
}
 catch(err) {
     app.Debug(err);
 }
    
    //Set variable if this is a fresh install
    var newX = app.IsNewVersion();
    
    if (newX) {
      app.ExtractAssets();  
        }
    
    //Set variable if internet connection is active
    var netX = app.IsConnected();
    app.Debug( "Internet connection: " + netX );
    
    //Set app to full screen mode.
    app.SetScreenMode( "Full" );

    
//End Global Settings
    
    
//Create Splash Screen layout
	s_lay = app.CreateLayout( "linear", "FillXY" );	
	s_lay.SetBackColor( "#fc8326" );
    //Splash Screen logo.
    img = app.CreateImage( "Img/logo.png", 0.25, -1 );
    img.SetMargins( 0, 0.18, 0, 0 );
    s_lay.AddChild( img );
    //Splash Screen text.
    img2 = app.CreateImage( "Img/logo-text.png", 0.9, -1 );
    img2.SetMargins( 0, 0.01, 0, 0 );
    s_lay.AddChild( img2 );
//END Splash Screen Layout Code
    
	//Create the Main Layout.
	lay = app.CreateLayout( "linear", "VCenter,FillXY" );	
    
	//Create the main webview control.
	web = app.CreateWebView( 1, 1 );
	web.SetOnProgress( web_OnProgess );
	web.SetOnError( web_OnError );
    lay.AddChild( web );
    
	
	//If this is a new install show the Swiper
	//if not show the basic splash screen
	swipe_lay = app.CreateLayout( "linear", "FillXY" );
	if (showSwipe != "NO") 
	{
    web2 = app.CreateWebView( 1, 1 );
    swipe_lay.AddChild( web2 );
    app.AddLayout( swipe_lay );
    app.ShowProgress("");
    web2.LoadUrl( "swipe.html" )
    web.LoadUrl( "https://www.mannabase.com/?ref=81aude9eze" );
    } else {
    swipe_lay.SetVisibility( "Gone" );    
    app.ShowProgress("");
    app.AddLayout( s_lay );
    web.LoadUrl( "https://www.mannabase.com/?ref=81aude9eze" );
        }
}

//Callback for Slider webview progress
function web2_OnProgess( progress ) 
{
    if( progress==100 ) app.HideProgress();
}


function endSlide() 
{
    app.DestroyLayout( swipe_lay );
    app.AddLayout( lay );

try {
    var fldr = app.GetPrivateFolder("manna");
    app.WriteFile( fldr + "/settings.txt", "NO");
}
 catch(err) {
     app.Debug(err);
 } 

   }



//Callback durring page load progress for 'web' WebView.
function web_OnProgess( progress )
{
        if (swipe_lay.GetVisibility()=="Show") {
            return;   
        }

    var baseUrl = "mannabase.com";
    var url = web.GetUrl();
    var pos = url.lastIndexOf(baseUrl);
    if (pos == -1) {
        app.Debug( "bad url " + url );
        if (web.CanGoBack()) web.Back();
}
    	if( progress==100 & s_lay.GetVisibility()=="Show" ) {
    	    app.HideProgress();
    	    s_lay.SetVisibility( "Gone" );
    	    app.AddLayout( lay );
    	   
    	} else if( progress==100 ) {
    	    app.HideProgress();
    	}

}

//Do something if webview has an error
function web_OnError( ) {
    app.HideProgress
    lay.SetVisibility("Gone");
    s_lay.SetVisibility("Show");
    app.Alert("There has been an error contacting the server.", "Network Error")
}

