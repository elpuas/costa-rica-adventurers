<?php

/**
 * Contact Form 7 Customizations
 *
 * @package CostaRicaAdventurers
 */

namespace CostaRicaAdventurers;

use WPCF7_ContactForm;

/**
 * Hide the success message for a specific form
 */
add_filter('wpcf7_display_message', function ($message, $status) {

    if ('mail_sent' === $status && function_exists('WPCF7') && WPCF7_ContactForm::get_current()->id() == "420a07c") {
        return '';
    }
    return $message;
}, 10, 2);
