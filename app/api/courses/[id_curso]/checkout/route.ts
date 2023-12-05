import Stripe from "stripe";
import { currentUser } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";
import { stripe } from "@/lib/stripe";

export async function POST(
    req: Request,
    { params }: { params: { id_curso: string } }
) {
    try {
        const user = await currentUser();

        if (!user || !user.id || !user.emailAddresses?.[0]?.emailAddress) {
            return new NextResponse("No autorizado", { status: 401 });
        }

        const course = await db.tbl_cursos.findUnique({
            where: {
                id_curso: parseInt(params.id_curso),
                publicado: true,
            }
        });

        const purchase = await db.tbl_compras.findUnique({
            where: {
                userId_curso_uuid: {
                    userId: user.id,
                    curso_uuid: course?.uuid!,
                }
            }
        });

        if (purchase) {
            return new NextResponse("Curso adquirido anteriormente", { status: 400 });
        }

        if (!course) {
            return new NextResponse("No fue encontrado", { status: 404 });
        }

        const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [
            {
                quantity: 1,
                price_data: {
                    currency: "USD",
                    product_data: {
                        name: course.titulo,
                        description: course.descripcion!,
                    },
                    unit_amount: Math.round(course.precio! * 100),
                }
            }
        ];

        let stripeCustomer = await db.tbl_stripe_clientes.findUnique({
            where: {
                userId: user.id,
            },
            select: {
                stripeCustomerId: true,
            }
        });

        if (!stripeCustomer) {
            const customer = await stripe.customers.create({
                email: user.emailAddresses[0].emailAddress,
            });

            stripeCustomer = await db.tbl_stripe_clientes.create({
                data: {
                    userId: user.id,
                    stripeCustomerId: customer.id,
                }
            });
        }

        const session = await stripe.checkout.sessions.create({
            customer: stripeCustomer.stripeCustomerId,
            line_items,
            mode: 'payment',
            success_url: `${process.env.NEXT_PUBLIC_APP_URL}/courses/${course.uuid}?success=1`,
            cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/courses/${course.uuid}?canceled=1`,
            metadata: {
                courseId: course.id_curso,
                courseUuid: course.uuid,
                userId: user.id,
            }
        });

        return NextResponse.json({ url: session.url });
    } catch (error) {
        console.log("[COURSE_ID_CHECKOUT]", error);
        return new NextResponse("Error Interno", { status: 500 })
    }
}
