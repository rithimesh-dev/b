import React, { useEffect, useRef } from 'react';

const FluidBackground = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        // Simulation parameters
        const SIM_RESOLUTION = 128;
        const DYE_RESOLUTION = 512;
        const DENSITY_DISSIPATION = 0.97;
        const VELOCITY_DISSIPATION = 0.98;
        const PRESSURE = 0.8;
        const PRESSURE_ITERATIONS = 20;
        const CURL = 30;
        const SPLAT_RADIUS = 0.25;
        const SPLAT_FORCE = 6000;

        let width, height;
        let pointer = { x: 0, y: 0, dx: 0, dy: 0, moved: false };

        // Grid structures
        // We'll use a simplified solver for React/Canvas performance
        // Based on Jos Stam's Real-Time Fluid Dynamics for Games

        let size = SIM_RESOLUTION * SIM_RESOLUTION;
        let density = new Float32Array(size);
        let u = new Float32Array(size); // Velocity X
        let v = new Float32Array(size); // Velocity Y
        let u_prev = new Float32Array(size);
        let v_prev = new Float32Array(size);
        let dens_prev = new Float32Array(size);

        const resize = () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        };

        const getIndex = (x, y) => {
            return Math.min(Math.max(x, 0), SIM_RESOLUTION - 1) + Math.min(Math.max(y, 0), SIM_RESOLUTION - 1) * SIM_RESOLUTION;
        };

        const addSource = (x, s, dt) => {
            for (let i = 0; i < size; i++) x[i] += s[i] * dt;
        };

        const setBnd = (b, x) => {
            for (let i = 1; i < SIM_RESOLUTION - 1; i++) {
                x[getIndex(0, i)] = b === 1 ? -x[getIndex(1, i)] : x[getIndex(1, i)];
                x[getIndex(SIM_RESOLUTION - 1, i)] = b === 1 ? -x[getIndex(SIM_RESOLUTION - 2, i)] : x[getIndex(SIM_RESOLUTION - 2, i)];
                x[getIndex(i, 0)] = b === 2 ? -x[getIndex(i, 1)] : x[getIndex(i, 1)];
                x[getIndex(i, SIM_RESOLUTION - 1)] = b === 2 ? -x[getIndex(i, SIM_RESOLUTION - 2)] : x[getIndex(i, SIM_RESOLUTION - 2)];
            }
            x[getIndex(0, 0)] = 0.5 * (x[getIndex(1, 0)] + x[getIndex(0, 1)]);
            x[getIndex(0, SIM_RESOLUTION - 1)] = 0.5 * (x[getIndex(1, SIM_RESOLUTION - 1)] + x[getIndex(0, SIM_RESOLUTION - 2)]);
            x[getIndex(SIM_RESOLUTION - 1, 0)] = 0.5 * (x[getIndex(SIM_RESOLUTION - 2, 0)] + x[getIndex(SIM_RESOLUTION - 1, 1)]);
            x[getIndex(SIM_RESOLUTION - 1, SIM_RESOLUTION - 1)] = 0.5 * (x[getIndex(SIM_RESOLUTION - 2, SIM_RESOLUTION - 1)] + x[getIndex(SIM_RESOLUTION - 1, SIM_RESOLUTION - 2)]);
        };

        const linSolve = (b, x, x0, a, c) => {
            const cRecip = 1.0 / c;
            for (let k = 0; k < PRESSURE_ITERATIONS; k++) {
                for (let j = 1; j < SIM_RESOLUTION - 1; j++) {
                    for (let i = 1; i < SIM_RESOLUTION - 1; i++) {
                        x[getIndex(i, j)] =
                            (x0[getIndex(i, j)] +
                                a *
                                (x[getIndex(i + 1, j)] +
                                    x[getIndex(i - 1, j)] +
                                    x[getIndex(i, j + 1)] +
                                    x[getIndex(i, j - 1)])) *
                            cRecip;
                    }
                }
                setBnd(b, x);
            }
        };

        const diffuse = (b, x, x0, diff, dt) => {
            const a = dt * diff * (SIM_RESOLUTION - 2) * (SIM_RESOLUTION - 2);
            linSolve(b, x, x0, a, 1 + 4 * a);
        };

        const project = (u, v, p, div) => {
            for (let j = 1; j < SIM_RESOLUTION - 1; j++) {
                for (let i = 1; i < SIM_RESOLUTION - 1; i++) {
                    div[getIndex(i, j)] =
                        (-0.5 *
                            (u[getIndex(i + 1, j)] -
                                u[getIndex(i - 1, j)] +
                                v[getIndex(i, j + 1)] -
                                v[getIndex(i, j - 1)])) /
                        SIM_RESOLUTION;
                    p[getIndex(i, j)] = 0;
                }
            }
            setBnd(0, div);
            setBnd(0, p);
            linSolve(0, p, div, 1, 4);

            for (let j = 1; j < SIM_RESOLUTION - 1; j++) {
                for (let i = 1; i < SIM_RESOLUTION - 1; i++) {
                    u[getIndex(i, j)] -= 0.5 * (p[getIndex(i + 1, j)] - p[getIndex(i - 1, j)]) * SIM_RESOLUTION;
                    v[getIndex(i, j)] -= 0.5 * (p[getIndex(i, j + 1)] - p[getIndex(i, j - 1)]) * SIM_RESOLUTION;
                }
            }
            setBnd(1, u);
            setBnd(2, v);
        };

        const advect = (b, d, d0, u, v, dt) => {
            let i0, j0, i1, j1;
            let x, y, s0, t0, s1, t1;
            let dt0 = dt * (SIM_RESOLUTION - 2);

            for (let j = 1; j < SIM_RESOLUTION - 1; j++) {
                for (let i = 1; i < SIM_RESOLUTION - 1; i++) {
                    x = i - dt0 * u[getIndex(i, j)];
                    y = j - dt0 * v[getIndex(i, j)];

                    if (x < 0.5) x = 0.5;
                    if (x > SIM_RESOLUTION - 1.5) x = SIM_RESOLUTION - 1.5;
                    i0 = Math.floor(x);
                    i1 = i0 + 1;

                    if (y < 0.5) y = 0.5;
                    if (y > SIM_RESOLUTION - 1.5) y = SIM_RESOLUTION - 1.5;
                    j0 = Math.floor(y);
                    j1 = j0 + 1;

                    s1 = x - i0;
                    s0 = 1.0 - s1;
                    t1 = y - j0;
                    t0 = 1.0 - t1;

                    d[getIndex(i, j)] =
                        s0 * (t0 * d0[getIndex(i0, j0)] + t1 * d0[getIndex(i0, j1)]) +
                        s1 * (t0 * d0[getIndex(i1, j0)] + t1 * d0[getIndex(i1, j1)]);
                }
            }
            setBnd(b, d);
        };

        const step = (dt) => {
            // Velocity step
            diffuse(1, u_prev, u, 0, dt); // Viscosity 0 for water-like
            diffuse(2, v_prev, v, 0, dt);

            project(u_prev, v_prev, u, v);

            advect(1, u, u_prev, u_prev, v_prev, dt);
            advect(2, v, v_prev, u_prev, v_prev, dt);

            project(u, v, u_prev, v_prev);

            // Density step
            diffuse(0, dens_prev, density, 0, dt);
            advect(0, density, dens_prev, u, v, dt);

            // Decay
            for (let i = 0; i < size; i++) {
                density[i] *= DENSITY_DISSIPATION;
                u[i] *= VELOCITY_DISSIPATION;
                v[i] *= VELOCITY_DISSIPATION;
            }
        };

        const render = () => {
            ctx.clearRect(0, 0, width, height);

            // Draw fluid
            const cellWidth = width / SIM_RESOLUTION;
            const cellHeight = height / SIM_RESOLUTION;

            // Create image data for faster rendering
            // Or just draw rects for "neon" look (glowy)
            // Let's draw glowy rects for the "neon" feel

            ctx.globalCompositeOperation = 'screen';

            for (let j = 0; j < SIM_RESOLUTION; j++) {
                for (let i = 0; i < SIM_RESOLUTION; i++) {
                    const d = density[getIndex(i, j)];
                    if (d > 0.01) {
                        const x = i * cellWidth;
                        const y = j * cellHeight;

                        // Neon White color with alpha based on density
                        const alpha = Math.min(d, 0.8);
                        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;

                        // Slight overlap to blend
                        ctx.fillRect(x - 1, y - 1, cellWidth + 2, cellHeight + 2);
                    }
                }
            }
        };

        const update = () => {
            const dt = 0.1;

            if (pointer.moved) {
                const gridX = Math.floor((pointer.x / width) * SIM_RESOLUTION);
                const gridY = Math.floor((pointer.y / height) * SIM_RESOLUTION);
                const index = getIndex(gridX, gridY);

                // Add density and velocity at mouse position
                density[index] += 2.0; // Add "dye"
                u[index] += pointer.dx * 0.5;
                v[index] += pointer.dy * 0.5;

                pointer.moved = false;
            }

            step(dt);
            render();
            requestAnimationFrame(update);
        };

        const handleMouseMove = (e) => {
            pointer.dx = e.clientX - pointer.x;
            pointer.dy = e.clientY - pointer.y;
            pointer.x = e.clientX;
            pointer.y = e.clientY;
            pointer.moved = true;
        };

        window.addEventListener('resize', resize);
        window.addEventListener('mousemove', handleMouseMove);

        resize();
        update();

        return () => {
            window.removeEventListener('resize', resize);
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 pointer-events-none z-0 opacity-40 mix-blend-screen"
        />
    );
};

export default FluidBackground;
