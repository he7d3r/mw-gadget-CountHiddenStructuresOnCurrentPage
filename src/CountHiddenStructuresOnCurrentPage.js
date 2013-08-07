/**
 * Inform the usage of the old "hiddenStructure" class in the pages listed at [[w:WP:Projetos/Padronização/hiddenStructure]]
 * @author: [[User:Helder.wiki]]
 * @tracking: [[Special:GlobalUsage/User:Helder.wiki/Tools/CountHiddenStructuresOnCurrentPage.js]] ([[File:User:Helder.wiki/Tools/CountHiddenStructuresOnCurrentPage.js]])
 */
/*jshint browser: true, camelcase: true, curly: true, eqeqeq: true, immed: true, latedef: true, newcap: true, noarg: true, noempty: true, nonew: true, quotmark: true, undef: true, unused: true, strict: true, trailing: true, laxbreak: true, maxlen: 120, evil: true, onevar: true */
/*global jQuery, mediaWiki */
( function ( mw, $ ) {
'use strict';

	function countHiddenStructures (){
		var api = new mw.Api(),
			$table = $( 'table:not(.diff)' ),
			$links = $table.find( 'a' );
		$table.find( 'tr:first' ).append( '<th>Número de<br />hiddenStructure<br />no código</th>' );
		api.get( {
			action: 'query',
			prop: 'links',
			pllimit: 'max',
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
				api.get( {
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
		&& mw.config.get( 'wgPageName' ) === 'Wikipédia:Projetos/Padronização/hiddenStructure'
		&& mw.config.get( 'wgAction' ) === 'view'
	){
		mw.loader.using( 'mediawiki.api', countHiddenStructures );
	}

}( mediaWiki, jQuery ) );