<?php
/**
 * Include dynamically added room/adult/child-age fields in CF7 emails,
 * across all WPML-translated forms.
 *
 * @package CostaRicaAdventurers
 */

namespace CostaRicaAdventurers\CF7;

use WPCF7_Submission;
use WPCF7_ContactForm;

// Hook into CF7 mail assembly
add_filter(
    'wpcf7_mail_components',
    __NAMESPACE__ . '\\append_dynamic_rooms_to_email',
    10,
    3
);

function append_dynamic_rooms_to_email( $components, $contact_form, $mail ) {
    // 1) Figure out the “original” CF7 form ID you care about (as an integer).
    //    This is the ID of your default-language form.
    $original_form_id = intval( get_option( 'target_cf7_form_id', 123 ) );

    // 2) Ask WPML what the translated form ID is in the current language.
    if ( function_exists( 'icl_object_id' ) ) {
        $current_language = apply_filters( 'wpml_current_language', null );
        $expected_form_id = apply_filters(
            'wpml_object_id',
            $original_form_id,
            'wpcf7_contact_form',
            false,
            $current_language
        );
    } else {
        // WPML not active: just use the original.
        $expected_form_id = $original_form_id;
    }

    // 3) Bail if this isn't the form we want.
    if ( $contact_form->id() !== $expected_form_id ) {
        return $components;
    }

    // 4) Grab the posted data
    $submission = WPCF7_Submission::get_instance();
    if ( ! $submission ) {
        error_log( '[CF7] No submission instance found.' );
        return $components;
    }
    $posted = $submission->get_posted_data();
    if ( empty( $posted ) || ! is_array( $posted ) ) {
        return $components;
    }

    // 5) Extract rooms/adults/children/ages
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

    // 6) Build the room-details text
    ksort( $rooms );
    $lines = [ "\n--- ROOM DETAILS ---" ];
    foreach ( $rooms as $room_num => $info ) {
        $a = isset( $info['adults'] )   ? esc_html( $info['adults'] )   : 'n/a';
        $c = isset( $info['children'] ) ? esc_html( $info['children'] ) : 'n/a';

        $lines[] = sprintf( 'Room %d:', $room_num );
        $lines[] = sprintf( '  • Adults: %s', $a );
        $lines[] = sprintf( '  • Children: %s', $c );

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

    // 7) Append safely into the email body
    $details = implode( "\n", $lines );
    if ( is_string( $components['body'] ) ) {
        $components['body'] .= "\n" . wp_kses_post( $details ) . "\n";
    } else {
        error_log( '[CF7] Email body not a string; could not append room details.' );
    }

    return $components;
}
