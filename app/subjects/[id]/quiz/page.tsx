"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, CheckCircle2, XCircle } from "lucide-react"
import Link from "next/link"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"

type Question = {
  id: string
  text: string
  options: string[]
  correctAnswer: number
}

const mockQuestions: Question[] = [
  {
    id: '1',
    text: 'What is the derivative of x²?',
    options: ['x', '2x', '2x²', 'x/2'],
    correctAnswer: 1
  },
  {
    id: '2',
    text: 'What is the integral of 2x?',
    options: ['x²', 'x²+C', 'x + C', '2x²'],
    correctAnswer: 1
  }
]

export default function QuizPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [showResults, setShowResults] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleAnswer = (questionId: string, answerIndex: number) => {
    setAnswers(prev => ({ ...prev, [questionId]: answerIndex }))
  }

  const handleSubmit = async () => {
    if (Object.keys(answers).length < mockQuestions.length) {
      toast({
        title: "Incomplete Quiz",
        description: "Please answer all questions before submitting.",
        variant: "destructive"
      })
      return
    }

    setIsSubmitting(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      setShowResults(true)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit quiz. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const calculateScore = () => {
    let correct = 0
    mockQuestions.forEach(question => {
      if (answers[question.id] === question.correctAnswer) {
        correct++
      }
    })
    return (correct / mockQuestions.length) * 100
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Link href={`/subjects/${params.id}`} className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center mb-2">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Subject
        </Link>
        <h1 className="text-3xl font-bold">Subject Quiz</h1>
        <p className="text-muted-foreground mt-1">Test your knowledge</p>
      </div>

      {showResults ? (
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Quiz Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <p className="text-4xl font-bold mb-4">{calculateScore()}%</p>
                <p className="text-muted-foreground">
                  You got {mockQuestions.filter(q => answers[q.id] === q.correctAnswer).length} out of {mockQuestions.length} questions correct
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            {mockQuestions.map((question, index) => (
              <Card key={question.id} className={answers[question.id] === question.correctAnswer ? "border-green-500" : "border-red-500"}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle>Question {index + 1}</CardTitle>
                    {answers[question.id] === question.correctAnswer ? (
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500" />
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="mb-4">{question.text}</p>
                  <div className="space-y-2">
                    {question.options.map((option, optionIndex) => (
                      <div
                        key={optionIndex}
                        className={`p-4 rounded-lg border ${
                          optionIndex === question.correctAnswer
                            ? "bg-green-50 border-green-200 dark:bg-green-900/20"
                            : optionIndex === answers[question.id]
                            ? "bg-red-50 border-red-200 dark:bg-red-900/20"
                            : "bg-gray-50 border-gray-200 dark:bg-gray-800"
                        }`}
                      >
                        {option}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="flex justify-end">
            <Button onClick={() => router.push(`/subjects/${params.id}`)}>
              Return to Subject
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Question {currentQuestion + 1} of {mockQuestions.length}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-6">{mockQuestions[currentQuestion].text}</p>
              <RadioGroup
                value={answers[mockQuestions[currentQuestion].id]?.toString()}
                onValueChange={(value) => handleAnswer(mockQuestions[currentQuestion].id, parseInt(value))}
              >
                {mockQuestions[currentQuestion].options.map((option, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                    <Label htmlFor={`option-${index}`}>{option}</Label>
                  </div>
                ))}
              </RadioGroup>
            </CardContent>
          </Card>

          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
              disabled={currentQuestion === 0}
            >
              Previous
            </Button>
            {currentQuestion === mockQuestions.length - 1 ? (
              <Button onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit Quiz"}
              </Button>
            ) : (
              <Button
                onClick={() => setCurrentQuestion(prev => Math.min(mockQuestions.length - 1, prev + 1))}
              >
                Next
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  )
} 