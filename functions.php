<?php
add_action( 'wp_enqueue_scripts', 'adventor_child_enqueue_styles', 100);
function adventor_child_enqueue_styles() {
	wp_enqueue_style( 'adventor-parent', get_theme_file_uri('/style.css') );
}