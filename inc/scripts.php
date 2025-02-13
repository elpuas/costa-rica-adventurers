<?php
/**
 * Register Scripts and Styles
 * 
 * @package costaricaadventurers
 */

namespace CostaRicaAdventurers;

/**
 * Enqueue scripts and styles.
 */
function register_scripts() {
    // Enqueue Parent Theme Stylesheet
    wp_enqueue_style(
        'adventor-parent',
        get_theme_file_uri( '/style.css' ),
        array(),
        filemtime( get_template_directory() . '/style.css' )
    );
    wp_enqueue_style( 
		'costa-rica-adventures-style', 
        get_stylesheet_directory_uri() . '/build/index.css', 
        [], 
        filemtime( get_stylesheet_directory() . '/build/index.css' ) );

	wp_enqueue_script( 
		'costa-rica-adventures-scripts', 
		get_stylesheet_directory_uri() . '/build/index.js', 
		[], 
		filemtime( get_stylesheet_directory() . '/build/index.js' ), 
		true
	);
}

add_action( 'wp_enqueue_scripts', __NAMESPACE__ . '\register_scripts' );