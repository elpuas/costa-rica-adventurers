<?php
/**
 * Include dynamically added room/adult/child-age fields in CF7 emails.
 *
 * @package CostaRicaAdventurers
 */

namespace CostaRicaAdventurers\CF7;

use WPCF7_Submission;
use WPCF7_ContactForm;

add_filter(
    'wpcf7_mail_components',
    __NAMESPACE__ . '\\append_dynamic_rooms_to_email',
    10,
    3
);

function append_dynamic_rooms_to_email( $components, $contact_form, $mail ) {
    // Only target the configured CF7 form ID (fallback to 'e101fab').
    $target_form_id = get_option( 'target_cf7_form_id', 'e101fab' );
    if ( $contact_form->id() !== $target_form_id ) {
        return $components;
    }

    // Get submission data.
    $submission = WPCF7_Submission::get_instance();
    if ( ! $submission ) {
        error_log( 'CF7 Submission instance not found.' );
        return $components;
    }
    $posted = $submission->get_posted_data();
    if ( empty( $posted ) || ! is_array( $posted ) ) {
        return $components;
    }

    // Collect room details.
    $rooms = [];
    foreach ( $posted as $key => $value ) {
        if ( preg_match( '/^room(\d+)_adults$/', $key, $m ) ) {
            $n = intval( $m[1], 10 );
            $rooms[ $n ]['adults'] = sanitize_text_field( $value );
        } elseif ( preg_match( '/^room(\d+)_children$/', $key, $m ) ) {
            $n = intval( $m[1], 10 );
            $rooms[ $n ]['children'] = sanitize_text_field( $value );
        } elseif ( preg_match( '/^child_age_(\d+)_(\d+)$/', $key, $m ) ) {
            $n = intval( $m[1], 10 );
            $i = intval( $m[2], 10 );
            $rooms[ $n ]['child_ages'][ $i ] = sanitize_text_field( $value );
        }
    }
    if ( empty( $rooms ) ) {
        return $components;
    }

    // Build the Room Details block.
    ksort( $rooms );
    $lines = [ "\n--- ROOM DETAILS ---" ];
    foreach ( $rooms as $room_num => $info ) {
        $adults   = isset( $info['adults'] )   ? esc_html( $info['adults'] )   : 'n/a';
        $children = isset( $info['children'] ) ? esc_html( $info['children'] ) : 'n/a';

        $lines[] = sprintf( 'Room %d:', $room_num );
        $lines[] = sprintf( '  • Adults: %s', $adults );
        $lines[] = sprintf( '  • Children: %s', $children );

        if ( ! empty( $info['child_ages'] ) ) {
            ksort( $info['child_ages'] );
            foreach ( $info['child_ages'] as $idx => $age ) {
                $label = ( '0' === $age )
                    ? esc_html__( 'Under 1', 'costa-rica-adventurers' )
                    : esc_html( $age );
                $lines[] = sprintf( '    – Child %d age: %s', $idx, $label );
            }
        }
    }

    // Append safely to the email body.
    $body = implode( "\n", $lines );
    if ( is_string( $components['body'] ) ) {
        $components['body'] .= "\n" . wp_kses_post( $body ) . "\n";
    } else {
        error_log( 'Email body is not a string.' );
    }

    return $components;
}
