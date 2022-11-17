/* eslint-disable jsx-a11y/anchor-is-valid */
import * as React from 'react'
import { useState } from 'react'
import ChartWrapper from './Chart/ChartWrapper'
import './Metrics.scss'

const data = {
  "name": "",
  "groupKind": "pod",
  "refreshRate": "",
  "tabs": [
    "Golden Signal"
  ],
  "rows": [
    {
      "name": "pod",
      "title": "Pods",
      "tab": "Golden Signal",
      "graphs": [
        {
          "name": "pod_cpu_line",
          "title": "CPU",
          "description": "",
          "graphType": "line",
          "metricName": "pod",
          "yAxisUnit": "",
          "valueRounding": 0
        },
        {
          "name": "pod_cpu_pie",
          "title": "CPU Avg",
          "description": "",
          "graphType": "pie",
          "metricName": "pod",
          "yAxisUnit": "",
          "valueRounding": 0
        },
        {
          "name": "pod_memory_line",
          "title": "Memory",
          "description": "",
          "graphType": "line",
          "metricName": "pod",
          "yAxisUnit": "",
          "valueRounding": 0
        },
        {
          "name": "pod_memory_pie",
          "title": "Mem Avg",
          "description": "",
          "graphType": "pie",
          "metricName": "pod",
          "yAxisUnit": "",
          "valueRounding": 0
        }
      ]
    },
    {
      "name": "container",
      "title": "Containers",
      "tab": "Golden Signal",
      "graphs": [
        {
          "name": "container_cpu_line",
          "title": "CPU",
          "description": "",
          "graphType": "line",
          "metricName": "container",
          "yAxisUnit": "",
          "valueRounding": 0
        },
        {
          "name": "container_cpu_pie",
          "title": "CPU Avg",
          "description": "",
          "graphType": "pie",
          "metricName": "container",
          "yAxisUnit": "",
          "valueRounding": 0
        },
        {
          "name": "container_memory_line",
          "title": "Memory",
          "description": "",
          "graphType": "line",
          "metricName": "container",
          "yAxisUnit": "",
          "valueRounding": 0
        },
        {
          "name": "container_memory_pie",
          "title": "Mem Avg",
          "description": "",
          "graphType": "pie",
          "metricName": "container",
          "yAxisUnit": "",
          "valueRounding": 0
        }
      ]
    }
  ],
  "providerType": "prometheus"
}

export const Metrics = ({ application, resource, events, duration, setHasMetrics, isLoading, setIsLoading }: any) => {
  const resourceName = resource.kind === 'Application' ? '' : resource?.metadata?.name
  const [dashboard, setDashboard] = useState<any>({})
  const [filterChart, setFilterChart] = useState<any>({})
  const [highlight, setHighlight] = useState<any>({})
  const [selectedTab, setSelectedTab] = useState<string>("")

  // const namespace = resource?.metadata?.namespace || ''
  const application_name = application?.metadata?.name || ''
  // const project = application?.spec?.project || ''
  // const uid = application?.metadata?.uid || ''

  setIsLoading(false)
  setHasMetrics(true)
  setDashboard(data)
  if (data.tabs.length) {
    setSelectedTab(data.tabs[0])
  }

  return (
    <div>
      {dashboard?.tabs?.length &&
        <div className="application-metrics__Tabs" >
          {dashboard?.tabs?.map((tab: string) => {
            return <div
              className={`application-metrics__Tab ${selectedTab === tab ? 'active' : ''}`}
              onClick={() => { setSelectedTab(tab) }}
              key={tab}
            >
              {tab}
            </div>
          })}
          {dashboard?.rows?.filter((r: any) => !dashboard?.tabs?.includes(r.tab))?.length > 0 &&
            <div
              className={`application-metrics__Tab ${selectedTab === 'More' ? 'active' : ''}`}
              onClick={() => { setSelectedTab('More') }}
              key={'More'}
            >
              More
            </div>
          }
        </div>
      }

      {!isLoading && dashboard?.rows && !dashboard?.rows?.filter((r: any) => dashboard?.tabs?.includes(r.tab) || selectedTab === 'More')?.length &&
        <p>No charts assigned to the <strong>{selectedTab}</strong> tab.</p>
      }

      {dashboard?.rows?.map((row: any) => {
        if (dashboard?.tabs?.length && row?.tab !== selectedTab && !(!row?.tab && selectedTab === "More")) {
          return <></>
        }
        return (
          <>
            <div className='application-metrics'>
              <span className='application-metrics__RowTitle'>
                {row.title}
              </span>
            </div>
            <div className='application-metrics__ChartContainerFlex'>
              {row?.graphs?.map((graph: any) => {
                const url = `https://localhost:8080/api/v1/applications/metricsqueryruns/resource?resourceName=rollouts-demo&namespace=default&name=metricsqueryruns&version=v1&kind=MetricQueryRun`
                return (
                  <ChartWrapper
                    application_name={application_name}
                    filterChart={filterChart}
                    setFilterChart={setFilterChart}
                    highlight={highlight}
                    setHighlight={setHighlight}
                    events={events}
                    queryPath={url}
                    resource={resource}
                    groupBy={graph.metricName || row.name}
                    name={resourceName}
                    yUnit={graph.yAxisUnit || ''}
                    valueRounding={graph.valueRounding || 10}
                    labelKey={graph.title}
                    metric={graph.name}
                    graphType={graph.graphType}
                  />
                )
              })}
            </div>
          </>
        )
      })}
    </div>
  )
}

export default Metrics
