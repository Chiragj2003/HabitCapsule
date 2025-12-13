import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-zinc-900 via-zinc-950 to-black">
            <div className="w-full max-w-md">
                <SignUp
                    appearance={{
                        elements: {
                            formButtonPrimary:
                                "bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700",
                            card: "bg-zinc-900/80 backdrop-blur-xl border border-zinc-800",
                            headerTitle: "text-white",
                            headerSubtitle: "text-zinc-400",
                            socialButtonsBlockButton:
                                "bg-zinc-800 border-zinc-700 text-white hover:bg-zinc-700",
                            formFieldLabel: "text-zinc-300",
                            formFieldInput:
                                "bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500",
                            footerActionLink: "text-violet-400 hover:text-violet-300",
                        },
                    }}
                    forceRedirectUrl="/dashboard"
                />
            </div>
        </div>
    );
}
