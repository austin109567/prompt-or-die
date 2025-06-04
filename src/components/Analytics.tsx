import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar } from "recharts";

const analyticsData = [
  { date: "Mar 1", views: 23, shares: 5, uses: 12 },
  { date: "Mar 2", views: 35, shares: 7, uses: 18 },
  { date: "Mar 3", views: 45, shares: 9, uses: 24 },
  { date: "Mar 4", views: 30, shares: 4, uses: 15 },
  { date: "Mar 5", views: 55, shares: 12, uses: 30 },
  { date: "Mar 6", views: 40, shares: 8, uses: 22 },
  { date: "Mar 7", views: 60, shares: 15, uses: 35 }
];

const modelUsageData = [
  { name: "GPT-4", value: 65 },
  { name: "Claude", value: 25 },
  { name: "Llama", value: 10 }
];

const Analytics = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Analytics</CardTitle>
        <CardDescription>
          Track usage and performance of your prompts
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview">
          <TabsList className="mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="usage">Usage</TabsTrigger>
            <TabsTrigger value="models">Models</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <div className="h-[300px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={analyticsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="views" stroke="#10B981" activeDot={{ r: 8 }} />
                  <Line type="monotone" dataKey="shares" stroke="#3B82F6" />
                  <Line type="monotone" dataKey="uses" stroke="#8B5CF6" />
                </LineChart>
              </ResponsiveContainer>
            </div>
            
            <div className="grid grid-cols-3 gap-4 mt-4">
              <div className="p-4 bg-muted/30 rounded-lg">
                <p className="text-xs text-muted-foreground">Total Views</p>
                <p className="text-2xl font-bold mt-1">288</p>
                <p className="text-xs text-green-500 mt-1">↑ 12% this week</p>
              </div>
              <div className="p-4 bg-muted/30 rounded-lg">
                <p className="text-xs text-muted-foreground">Total Shares</p>
                <p className="text-2xl font-bold mt-1">60</p>
                <p className="text-xs text-green-500 mt-1">↑ 8% this week</p>
              </div>
              <div className="p-4 bg-muted/30 rounded-lg">
                <p className="text-xs text-muted-foreground">Total Uses</p>
                <p className="text-2xl font-bold mt-1">156</p>
                <p className="text-xs text-green-500 mt-1">↑ 15% this week</p>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="usage">
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Prompt Usage Over Time</h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analyticsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="uses" fill="#10B981" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mt-8">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Most Active Day</p>
                  <p className="font-medium">March 7</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Average Uses Per Day</p>
                  <p className="font-medium">22.3</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Total API Calls</p>
                  <p className="font-medium">312</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Completion Rate</p>
                  <p className="font-medium">95.8%</p>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="models">
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Model Usage Distribution</h3>
              
              <div className="space-y-3 mt-6">
                <div className="flex justify-between items-center">
                  <p className="text-sm">GPT-4</p>
                  <p className="text-sm font-medium">65%</p>
                </div>
                <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary" style={{ width: "65%" }}></div>
                </div>
                
                <div className="flex justify-between items-center">
                  <p className="text-sm">Claude</p>
                  <p className="text-sm font-medium">25%</p>
                </div>
                <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-accent" style={{ width: "25%" }}></div>
                </div>
                
                <div className="flex justify-between items-center">
                  <p className="text-sm">Llama</p>
                  <p className="text-sm font-medium">10%</p>
                </div>
                <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-yellow-500" style={{ width: "10%" }}></div>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4 mt-8">
                <div className="p-4 bg-muted/30 rounded-lg">
                  <p className="text-xs text-muted-foreground">Total Tokens</p>
                  <p className="text-2xl font-bold mt-1">156K</p>
                </div>
                <div className="p-4 bg-muted/30 rounded-lg">
                  <p className="text-xs text-muted-foreground">Avg. Response Time</p>
                  <p className="text-2xl font-bold mt-1">1.2s</p>
                </div>
                <div className="p-4 bg-muted/30 rounded-lg">
                  <p className="text-xs text-muted-foreground">Success Rate</p>
                  <p className="text-2xl font-bold mt-1">98.3%</p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default Analytics;