import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function CardSkeleton() {
  return (
    <Card className="shadow-lg flex flex-col min-h-[14rem] max-h-[30rem]">
      <CardHeader className="pb-2">
        <CardDescription>
          <span className="flex justify-between">
            <Skeleton className="h-4 w-32" />
            <span className="flex -space-x-3.5">
              {[...Array(3)].map((_, index) => (
                <Skeleton key={index} className="h-8 w-8 rounded-full" />
              ))}
            </span>
          </span>
        </CardDescription>
        <CardTitle>
          <Skeleton className="h-6 w-full" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-5/6 mb-2" />
        <Skeleton className="h-4 w-4/6" />
      </CardContent>
      <CardFooter className="flex pb-3.5 mt-auto">
        <Skeleton className="h-10 w-full" />
      </CardFooter>
    </Card>
  );
}
