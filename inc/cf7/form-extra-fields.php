<?php
/**
 * Include dynamically added room/adult/child-age fields in CF7 emails,
 *
 * @package CostaRicaAdventurers
 */

namespace CostaRicaAdventurers\CF7;

use WPCF7_Submission;

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

add_filter( 'wpcf7_mail_components', __NAMESPACE__ . '\\inject_room_details', 10, 3 );

function inject_room_details( $components, $contact_form, $mail ) {
    // Base (Spanish) form ID
    $original = 22963;

    // Map to current-language CF7 via WPML
    if ( function_exists( 'apply_filters' ) ) {
        $lang        = apply_filters( 'wpml_current_language', null );
        $expected_id = apply_filters( 'wpml_object_id', $original, 'wpcf7_contact_form', false, $lang );
    } else {
        $expected_id = $original;
    }

    if ( $contact_form->id() !== $expected_id ) {
        // Not our form → leave [room_details] untouched (or remove)
        $components['body'] = str_replace( '[room_details]', '', $components['body'] );
        return $components;
    }

    $submission = WPCF7_Submission::get_instance();
    $posted     = $submission ? $submission->get_posted_data() : [];

    // Build the details text
    $rooms = [];
    foreach ( (array) $posted as $key => $value ) {
        if ( preg_match( '/^room(\d+)_adults$/', $key, $m ) ) {
            $n                 = (int) $m[1];
            $rooms[ $n ]['adults'] = sanitize_text_field( $value );
        } elseif ( preg_match( '/^room(\d+)_children$/', $key, $m ) ) {
            $n                   = (int) $m[1];
            $rooms[ $n ]['children'] = sanitize_text_field( $value );
        }
    }

    if ( empty( $rooms ) ) {
        $details = ''; // no rooms → empty
    } else {
        ksort( $rooms );
        $lines = [];
        foreach ( $rooms as $num => $info ) {
            $a = $info['adults'] ?? 'n/a';
            $c = $info['children'] ?? 'n/a';
            $lines[] = sprintf( '👨‍👩‍👧‍👦 Adultos en habitación %d: %s', $num, esc_html( $a ) );
            $lines[] = sprintf( '🧒 Niños en habitación %d: %s',   $num, esc_html( $c ) );
            // child_ages if you need them...
        }
        $details = implode( "\n", $lines );
    }

    // Replace the [room_details] tag in the email body
    $components['body'] = str_replace( '[room_details]', $details, $components['body'] );

    return $components;
}
