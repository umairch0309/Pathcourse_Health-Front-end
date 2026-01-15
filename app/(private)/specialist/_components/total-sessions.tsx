'use client';
import {
  buildStyles,
  CircularProgressbarWithChildren,
} from 'react-circular-progressbar';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../../../../components/ui/card';

export function TotalSessions() {
  return (
    <Card className=" w-full lg:h-[350px] bg-background space-y-2 px-6">
      <CardHeader>
        <CardTitle className="text-foreground mb-3 font-bold">Sessions</CardTitle>
        <CardDescription className="text-muted-foreground -mb-6">
          Total no. of Sessions attended.
        </CardDescription>
      </CardHeader>

      <CardContent className="flex justify-center items-center mt-4">
        <div className="w-[150px] h-[150px] lg:w-[180px] lg:h-[180px] relative">
          {/* Total ring (light gray background) */}
          <CircularProgressbarWithChildren
            value={100}
            styles={buildStyles({
              rotation: 0,
              trailColor: '#f3f4f6',
              strokeLinecap: 'round',
              pathColor: '#f3f4f6',
            })}
          >
            {/* Completed segment (light purple) */}
            <CircularProgressbarWithChildren
              value={70}
              styles={buildStyles({
                rotation: 0.25,
                trailColor: 'transparent',
                strokeLinecap: 'round',
                pathColor: '#D1B9F2',
              })}
            >
              {/* Upcoming segment (dark purple) */}
              <CircularProgressbarWithChildren
                value={30}
                styles={buildStyles({
                  rotation: 0.75,
                  trailColor: 'transparent',
                  strokeLinecap: 'round',
                  pathColor: '#6715D3',
                })}
              >
                <div className="text-center">
                  <p className="text-xs text-muted-foreground mb-[-2px]">
                    Total sessions completed this month.
                  </p>
                  <p className="text-[24px] sm:text-[28px] font-bold text-foreground">08</p>
                </div>
              </CircularProgressbarWithChildren>
            </CircularProgressbarWithChildren>
          </CircularProgressbarWithChildren>
        </div>
      </CardContent>

      <CardFooter className="flex flex-wrap justify-center gap-2 sm:gap-3 mt-2">
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <span className="w-2 h-2 rounded-full bg-muted" />
          {' '}
          Total
        </div>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <span className="w-2 h-2 rounded-full bg-primary" />
          {' '}
          This Month
        </div>
      </CardFooter>
    </Card>
  );
}