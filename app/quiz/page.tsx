"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowRight, Check, MapPin, DollarSign, Calendar, Tag } from "lucide-react";
import { cn } from "@/lib/utils";

type Step = 'LOCATION' | 'BUDGET' | 'DATE' | 'TAGS';

const LOCATIONS = ["Westlands", "Kilimani", "Kileleshwa", "Lavington", "Riverside"];
const BUDGETS = ["40k - 60k", "60k - 80k", "80k - 100k", "100k+"];
const MOVE_DATES = ["Immediately", "This Month", "Next Month", "Just Looking"];
const TAGS = ["Pet Friendly", "Borehole", "Gym", "Pool", "DSQ", "Security", "Balcony"];

export default function QuizPage() {
    const router = useRouter();
    const [step, setStep] = useState<Step>('LOCATION');
    const [selections, setSelections] = useState({
        location: "",
        budget: "",
        date: "",
        tags: [] as string[]
    });

    const handleSelect = (key: keyof typeof selections, value: any) => {
        if (key === 'tags') {
            const current = selections.tags;
            const updated = current.includes(value)
                ? current.filter(t => t !== value)
                : [...current, value];
            setSelections({ ...selections, tags: updated });
        } else {
            setSelections({ ...selections, [key]: value });
            // Auto advance for single selection steps
            if (step === 'LOCATION') setStep('BUDGET');
            if (step === 'BUDGET') setStep('DATE');
            if (step === 'DATE') setStep('TAGS');
        }
    };

    const finishQuiz = () => {
        // Save to local storage or state management if needed
        localStorage.setItem('settlr_preferences', JSON.stringify(selections));
        router.push('/results');
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 flex items-center justify-center">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        {step === 'LOCATION' && <><MapPin className="text-settlr-green" /> Where to?</>}
                        {step === 'BUDGET' && <><DollarSign className="text-settlr-green" /> Budget?</>}
                        {step === 'DATE' && <><Calendar className="text-settlr-green" /> When?</>}
                        {step === 'TAGS' && <><Tag className="text-settlr-green" /> Must Haves?</>}
                    </CardTitle>
                    <CardDescription>
                        Step {step === 'LOCATION' ? 1 : step === 'BUDGET' ? 2 : step === 'DATE' ? 3 : 4} of 4
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">

                    {step === 'LOCATION' && LOCATIONS.map((loc) => (
                        <Button
                            key={loc}
                            variant="outline"
                            className="w-full justify-start h-14 text-lg"
                            onClick={() => handleSelect('location', loc)}
                        >
                            {loc}
                        </Button>
                    ))}

                    {step === 'BUDGET' && BUDGETS.map((bud) => (
                        <Button
                            key={bud}
                            variant="outline"
                            className="w-full justify-start h-14 text-lg"
                            onClick={() => handleSelect('budget', bud)}
                        >
                            {bud}
                        </Button>
                    ))}

                    {step === 'DATE' && MOVE_DATES.map((date) => (
                        <Button
                            key={date}
                            variant="outline"
                            className="w-full justify-start h-14 text-lg"
                            onClick={() => handleSelect('date', date)}
                        >
                            {date}
                        </Button>
                    ))}

                    {step === 'TAGS' && (
                        <div className="grid grid-cols-2 gap-3">
                            {TAGS.map((tag) => (
                                <div
                                    key={tag}
                                    className={cn(
                                        "cursor-pointer rounded-md border p-4 text-center transition-colors hover:bg-neutral-100",
                                        selections.tags.includes(tag) ? "border-settlr-green bg-green-50" : "border-neutral-200"
                                    )}
                                    onClick={() => handleSelect('tags', tag)}
                                >
                                    <div className="font-medium">{tag}</div>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="flex justify-between mt-6 pt-4 border-t">
                        {step !== 'LOCATION' && (
                            <Button variant="ghost" onClick={() => {
                                if (step === 'TAGS') setStep('DATE');
                                if (step === 'DATE') setStep('BUDGET');
                                if (step === 'BUDGET') setStep('LOCATION');
                            }}>Back</Button>
                        )}

                        {step === 'TAGS' && (
                            <Button className="ml-auto bg-settlr-green text-black hover:bg-settlr-green/90" onClick={finishQuiz}>
                                Find Matches <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        )}
                    </div>
                </CardContent>
            </Card>

        </div>
    );
}
