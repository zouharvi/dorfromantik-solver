use bevy::{
    prelude::*,
    input::mouse::{MouseButtonInput, MouseMotion, MouseWheel},
    sprite::MaterialMesh2dBundle,
    winit::WinitSettings,
};

use std::f32::consts::PI;

const SMALL_HEX_WIDTH: f32 = 40.0;
const BIG_HEX_WIDTH: f32 = SMALL_HEX_WIDTH * 3.0;

fn main() {
    App::new()
        .add_plugins(DefaultPlugins)
        // Only run the app when there is user input. This will significantly reduce CPU/GPU use.
        .insert_resource(WinitSettings::desktop_app())
        .add_startup_system(setup)
        .add_startup_system(setup2)
        .add_system(button_system)
        .add_system(print_mouse_events_system)
        .run();
}

const NORMAL_BUTTON: Color = Color::rgb(0.15, 0.15, 0.15);
const HOVERED_BUTTON: Color = Color::rgb(0.25, 0.25, 0.25);
const PRESSED_BUTTON: Color = Color::rgb(0.35, 0.75, 0.35);

fn button_system(
    mut interaction_query: Query<
        (&Interaction, &mut BackgroundColor, &Children),
        (Changed<Interaction>, With<Button>),
    >,
    mut text_query: Query<&mut Text>,
) {
    for (interaction, mut color, children) in &mut interaction_query {
        let mut text = text_query.get_mut(children[0]).unwrap();
        match *interaction {
            Interaction::Clicked => {
                text.sections[0].value = "Press".to_string();
                *color = PRESSED_BUTTON.into();
            }
            Interaction::Hovered => {
                text.sections[0].value = "Hover".to_string();
                *color = HOVERED_BUTTON.into();
            }
            Interaction::None => {
                text.sections[0].value = "Button".to_string();
                *color = NORMAL_BUTTON.into();
            }
        }
    }
}

fn setup(
    mut commands: Commands,
    asset_server: Res<AssetServer>,
    mut meshes: ResMut<Assets<Mesh>>,
    mut materials: ResMut<Assets<ColorMaterial>>,
) {
    // ui camera
    commands.spawn(Camera2dBundle::default());
    commands
        .spawn(NodeBundle {
            style: Style {
                size: Size::width(Val::Percent(100.0)),
                align_items: AlignItems::Center,
                justify_content: JustifyContent::Center,
                ..default()
            },
            ..default()
        })
        .with_children(|parent| {
            parent
                .spawn(ButtonBundle {
                    style: Style {
                        size: Size::new(Val::Px(150.0), Val::Px(65.0)),
                        // horizontally center child text
                        justify_content: JustifyContent::Center,
                        // vertically center child text
                        align_items: AlignItems::Center,
                        ..default()
                    },
                    background_color: NORMAL_BUTTON.into(),
                    ..default()
                })
                .with_children(|parent| {
                    parent.spawn(TextBundle::from_section(
                        "Button",
                        TextStyle {
                            font: asset_server.load("fonts/FiraSans-Bold.ttf"),
                            font_size: 40.0,
                            color: Color::rgb(0.9, 0.9, 0.9),
                        },
                    ));
                });
        });
}

fn setup2(
    mut commands: Commands,
    mut meshes: ResMut<Assets<Mesh>>,
    mut materials: ResMut<Assets<ColorMaterial>>,
) {
    // hexagons
    for i in 0..=2 {
        for j in 0..=2 {
            commands.spawn(MaterialMesh2dBundle {
                mesh: meshes
                    .add(shape::RegularPolygon::new(SMALL_HEX_WIDTH, 6).into())
                    .into(),
                material: materials.add(ColorMaterial::from(Color::Rgba {
                    red: 0.5 + (i as f32) / 2.0 / 2.0,
                    green: 0.5 + (j as f32) / 2.0 / 2.0,
                    blue: 0.5,
                    alpha: 1.0,
                })),
                transform: Transform::from_translation(Vec3::new(
                    3.0 * SMALL_HEX_WIDTH * (i as f32)
                        - (if j % 2 == 0 {
                            1.5 * SMALL_HEX_WIDTH
                        } else {
                            0.0
                        }),
                    f32::sqrt(3.0) / 2.0 * SMALL_HEX_WIDTH * (j as f32),
                    0.,
                ))
                .with_rotation(Quat::from_rotation_z(PI / 2.0)),
                ..default()
            });
        }
    }

    // main hexagon
    for i in 0..6 {
        let mut transform = Transform::from_translation(Vec3::new(300., -300., 0.));
        transform.rotate_around(
            Vec3::new(300., -300. + BIG_HEX_WIDTH / 2.0, 0.),
            Quat::from_rotation_z(2.0 * PI / 6.0 * (i as f32)),
        );

        commands.spawn(MaterialMesh2dBundle {
            mesh: meshes
                .add(shape::RegularPolygon::new(BIG_HEX_WIDTH / 2.0, 3).into())
                .into(),
            material: materials.add(ColorMaterial::from(Color::Rgba {
                red: 0.4 + (i as f32) / 6.0 * 0.6,
                green: 0.8,
                blue: 0.5,
                alpha: 1.0,
            })),
            transform: transform,
            ..default()
        });
    }
}

/// This system prints out all mouse events as they come in
fn print_mouse_events_system(
    mut mouse_button_input_events: EventReader<MouseButtonInput>,
    mut mouse_motion_events: EventReader<MouseMotion>,
    mut cursor_moved_events: EventReader<CursorMoved>,
    mut mouse_wheel_events: EventReader<MouseWheel>,
) {
    for event in mouse_button_input_events.iter() {
        info!("{:?}", event);
    }

    for event in mouse_motion_events.iter() {
        info!("{:?}", event);
    }

    for event in cursor_moved_events.iter() {
        info!("{:?}", event);
    }

    for event in mouse_wheel_events.iter() {
        info!("{:?}", event);
    }
}