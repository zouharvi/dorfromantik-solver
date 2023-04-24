use bevy::{prelude::*, sprite::MaterialMesh2dBundle};
use std::f32::consts::PI;

const SMALL_HEX_WIDTH: f32 = 40.0;
const BIG_HEX_WIDTH: f32 = SMALL_HEX_WIDTH * 3.0;

fn main() {
    App::new()
        .add_plugins(DefaultPlugins)
        .add_startup_system(setup)
        .run();
}

fn setup(
    mut commands: Commands,
    mut meshes: ResMut<Assets<Mesh>>,
    mut materials: ResMut<Assets<ColorMaterial>>,
) {
    commands.spawn(Camera2dBundle::default());

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
