<?php
/**
 * Register Scripts and Styles
 * 
 * @package costaricaadventurers
 */

namespace CostaRicaAdventurers;

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

/**
 * Enqueue scripts and styles.
 */
function register_scripts() {
     // Enqueue Parent Theme Stylesheet
    wp_enqueue_style(
        'adventor-parent',
        get_theme_file_uri( '/style.css' ),
        [],
        filemtime( get_template_directory() . '/style.css' )
    );

    // Enqueue Child Theme Stylesheet
    wp_enqueue_style(
        'costa-rica-adventures-style',
        get_stylesheet_directory_uri() . '/build/index.css',
        [],
        filemtime( get_stylesheet_directory() . '/build/index.css' )
    );

    // Get inquiry page ID from Tours Cart plugin settings
    $inquiry_page_id = intval( get_option( 'tours_cart_inquiry_page' ) );

    // Enqueue bundled script via WP Scripts (build/index.asset.php)
    $asset_file = get_stylesheet_directory() . '/build/index.asset.php';
    if ( file_exists( $asset_file ) ) {
        $asset = include $asset_file;

        wp_enqueue_script(
            'costa-rica-adventures-scripts',
            get_stylesheet_directory_uri() . '/build/index.js',
            $asset['dependencies'] ?? [],
            $asset['version'] ?? false,
            true
        );

        // Localize configuration for Tours Cart integration
        wp_localize_script(
            'costa-rica-adventures-scripts',
            'ToursCartCfg',
            [
                'storageKey'    => 'toursCart',
                'editToursURL'  => $inquiry_page_id ? get_permalink( $inquiry_page_id ) : '',
                'isInquiryPage' => (bool) ( $inquiry_page_id && is_page( $inquiry_page_id ) ),
            ]
        );

        // WPML: Get correct contact page URL for current language
        $default_contact_page = get_page_by_path( 'contact-us-at' );
        $translated_contact_page_id = $default_contact_page
            ? apply_filters( 'wpml_object_id', $default_contact_page->ID, 'page', true )
            : null;

        $redirect_url = $translated_contact_page_id
            ? get_permalink( $translated_contact_page_id )
            : '';

        wp_localize_script(
            'costa-rica-adventures-scripts',
            'contactRedirectData',
            [
                'redirectUrl' => $redirect_url,
            ]
        );
    }
}
add_action( 'wp_enqueue_scripts', __NAMESPACE__ . '\\register_scripts' );
