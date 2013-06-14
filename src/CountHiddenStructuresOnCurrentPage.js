/**
 * Warn about the usage of the old "hiddenStructure" class in the current page
 * @author: [[User:Helder.wiki]]
 * @tracking: [[Special:GlobalUsage/User:Helder.wiki/Tools/CountHiddenStructuresOnCurrentPage.js]] ([[File:User:Helder.wiki/Tools/CountHiddenStructuresOnCurrentPage.js]])
 */
/*jslint browser: true, white: true, plusplus: true*/
/*global jQuery, mediaWiki */
( function ( mw, $ ) {
'use strict';
	function countHiddenStructures (){
		var $table = $( 'table' ),
			$links = $table.find( 'a' );
		$table.find( 'tr:first' ).append( '<th>Usos</th>' );
		( new mw.Api() ).get( {
			action: 'query',
			prop: 'links',
			pllimit: 500,
			titles: mw.config.get( 'wgPageName' ),
			indexpageids: ''
		} ).done( function ( data ) {
			var list, i,
				processBatch,
				reOldCode = /hiddenStructure|\{\{[Oo]cultar[ _]estrutura/,
				batchSize = 40;
			list = $.map( data.query.pages[ data.query.pageids[0] ].links, function( link ){
				return link.title;
			} );
			processBatch = function ( data ) { 
				var i, page, count, $a, filter;
				filter = function(){
					return $( this ).text() === page.title;
				};
				for( i = 0; i < data.query.pageids.length; i++ ){
					page = data.query.pages[ data.query.pageids[i] ];
					if( page.missing === '' ){
						count = 0;
					} else {
						count = page.revisions[0]['*']
							.split( reOldCode ).length - 1;
					}
					$a = $links.filter( filter );
					$a.closest( 'tr' ).append( $( '<td>' ).text( count ) );
				}
			};
			for( i = 0; i < list.length; i += batchSize ){
				( new mw.Api() ).get( {
					action: 'query',
					titles: list.slice( i, i + batchSize ).join( '|' ),
					prop: 'revisions',
					rvprop: 'content',
					indexpageids: ''
				} ).done( processBatch );
			}
		} );
	}
 
	if( mw.config.get( 'wgDBname' ) === 'ptwiki'
		&& mw.config.get( 'wgAction' ) === 'view'
		&& mw.config.get( 'wgPageName' ) === 'Wikipédia:Projetos/Padronização/hiddenStructure'
	){
		mw.loader.using( 'mediawiki.api', countHiddenStructures );
	}
 
}( mediaWiki, jQuery ) );