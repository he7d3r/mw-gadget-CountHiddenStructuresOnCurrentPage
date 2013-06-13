/**
 * Warn about the usage of the old "hiddenStructure" class in the current page
 * @author: [[User:Helder.wiki]]
 * @tracking: [[Special:GlobalUsage/User:Helder.wiki/Tools/CountHiddenStructuresOnCurrentPage.js]] ([[File:User:Helder.wiki/Tools/CountHiddenStructuresOnCurrentPage.js]])
 */
/*jslint browser: true, white: true*/
/*global jQuery, mediaWiki */
( function ( mw, $ ) {
'use strict';
	if( wgDBname !== 'ptwiki' ){
		return;
	}
	( new mw.Api() ).get( {
		action: 'query',
		titles: mw.config.get( 'wgPageName' ),
		prop: 'revisions',
		rvprop: 'content',
		indexpageids: ''
	} ).done( function ( data ) {
		
		var text = data.query.pages[ data.query.pageids[0] ].revisions[0]['*'],
			count = text.split( /hiddenStructure|\{\{[Oo]cultar[ _]estrutura/).length - 1;
		if( count > 0 ){
			mw.loader.using( 'mediawiki.notify', function(){
				mw.notify( 'A classe "hiddenStructure" ainda é usada ' + count + ' vezes nesta página.' );
			} );
		}
	} );

}( mediaWiki, jQuery ) );