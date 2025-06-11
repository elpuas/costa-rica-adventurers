<?php
/**
 * Include dynamically added room/adult/child-age fields in CF7 emails,
 * across all WPML-translated forms.
 *
 * @package CostaRicaAdventurers
 */

namespace CostaRicaAdventurers\CF7;

use WPCF7_Submission;

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

add_filter('wpcf7_mail_components', __NAMESPACE__ . '\\append_dynamic_rooms_to_email', 10, 3);

function append_dynamic_rooms_to_email($components, $contact_form, $mail) {
    $allowed = [
        'e101fab',
        '401a739',
        '6e88dec',
        'ab39b00',
    ];

    if (!in_array((string)$contact_form->id(), $allowed, true)) {
        return $components;
    }

    $submission = WPCF7_Submission::get_instance();
    if (!$submission) {
        return $components;
    }

    $posted = $submission->get_posted_data();
    if (empty($posted) || !is_array($posted)) {
        return $components;
    }

    $rooms = [];
    foreach ($posted as $key => $value) {
        if (preg_match('/^room(\d+)_adults$/', $key, $m)) {
            $n = (int)$m[1];
            $rooms[$n]['adults'] = sanitize_text_field($value);
        } elseif (preg_match('/^room(\d+)_children$/', $key, $m)) {
            $n = (int)$m[1];
            $rooms[$n]['children'] = sanitize_text_field($value);
        } elseif (preg_match('/^child_age_(\d+)_(\d+)$/', $key, $m)) {
            $n = (int)$m[1];
            $i = (int)$m[2];
            $rooms[$n]['child_ages'][$i] = sanitize_text_field($value);
        }
    }

    if (empty($rooms)) {
        return $components;
    }

    ksort($rooms);
    $lines = ["\n--- ROOM DETAILS ---"];
    foreach ($rooms as $room_num => $info) {
        $a = isset($info['adults']) ? esc_html($info['adults']) : 'n/a';
        $c = isset($info['children']) ? esc_html($info['children']) : 'n/a';
        $lines[] = sprintf('Room %d:', $room_num);
        $lines[] = sprintf('  • Adults: %s', $a);
        $lines[] = sprintf('  • Children: %s', $c);

        if (!empty($info['child_ages'])) {
            ksort($info['child_ages']);
            foreach ($info['child_ages'] as $idx => $age) {
                $label = ('0' === $age) ? esc_html__('Under 1', 'costa-rica-adventurers') : esc_html($age);
                $lines[] = sprintf('    – Child %d age: %s', $idx, $label);
            }
        }
    }

    $details = implode("\n", $lines);
    if (is_string($components['body'])) {
        $components['body'] .= "\n" . wp_kses_post($details) . "\n";
    }

    return $components;
}