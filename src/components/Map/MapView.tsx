import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { useFleet } from '../../context/FleetContext';
import { getMapboxToken, isMapboxConfigured } from '../../services/mapbox';
import { HYDERABAD_CENTER } from '../../data/simulationData';
import { MapLegend } from './MapLegend';
import { AlertTriangle, ZoomIn, ZoomOut, Compass } from 'lucide-react';
import ReactDOM from 'react-dom/client';
import { RiderBikeMarker } from './RiderBikeMarker';
import { RestaurantMarker } from './RestaurantMarker';
import { CustomerMarker } from './CustomerMarker';

export const MapView: React.FC<{ className?: string }> = ({ className = '' }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [hasToken, setHasToken] = useState(false);

  const {
    riders,
    restaurants,
    customers,
    orders,
    routes,
    selectedRiderId,
    selectedOrderId,
    setSelectedRiderId,
    setSelectedOrderId
  } = useFleet();

  // Active highlighted rider ID
  const activeHighlightedRiderId = selectedRiderId || (
    selectedOrderId ? orders.find(o => o.id === selectedOrderId)?.assignedRiderId : null
  );

  // Markers references
  const riderMarkersRef = useRef<Map<string, { marker: mapboxgl.Marker; root: ReactDOM.Root }>>(new Map());
  const restMarkersRef = useRef<Map<string, { marker: mapboxgl.Marker; root: ReactDOM.Root }>>(new Map());
  const custMarkersRef = useRef<Map<string, { marker: mapboxgl.Marker; root: ReactDOM.Root }>>(new Map());

  useEffect(() => {
    setHasToken(isMapboxConfigured());
  }, []);

  // Initialize Mapbox map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    const token = getMapboxToken();

    if (!token) return;

    mapboxgl.accessToken = token;

    try {
      const map = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: 'mapbox://styles/mapbox/dark-v11',
        center: [HYDERABAD_CENTER.lng, HYDERABAD_CENTER.lat],
        zoom: HYDERABAD_CENTER.zoom,
        pitch: 28,
        bearing: -5,
        attributionControl: false
      });

      map.addControl(new mapboxgl.NavigationControl({ showCompass: true, showZoom: false }), 'top-right');

      map.on('load', () => {
        mapRef.current = map;
        setMapLoaded(true);
      });

      return () => {
        map.remove();
        mapRef.current = null;
        setMapLoaded(false);
      };
    } catch (e) {
      console.error('Failed to initialize Mapbox:', e);
    }
  }, [hasToken]);

  // Sync Routes with Selected Rider Route Highlighting & Dimming Non-Selected
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapLoaded) return;

    Object.entries(routes).forEach(([riderId, route]) => {
      const sourceId = `route-source-${riderId}`;
      const layerId = `route-layer-${riderId}`;
      const glowLayerId = `route-glow-${riderId}`;
      const rider = riders.find(r => r.id === riderId);
      const color = rider ? rider.color : '#3b82f6';

      const isSelected = activeHighlightedRiderId === riderId;
      const hasAnySelection = Boolean(activeHighlightedRiderId);

      // Selected: 100% brightness & thick line. Others: 30% opacity dimming.
      const lineWidth = isSelected ? 5.5 : hasAnySelection ? 2.5 : 3.5;
      const lineOpacity = isSelected ? 1.0 : hasAnySelection ? 0.28 : 0.85;
      const glowOpacity = isSelected ? 0.65 : hasAnySelection ? 0.1 : 0.35;
      const glowWidth = isSelected ? 14 : 7;

      const geojsonData: GeoJSON.Feature<GeoJSON.LineString> = {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates: route.coordinates
        }
      };

      if (map.getSource(sourceId)) {
        (map.getSource(sourceId) as mapboxgl.GeoJSONSource).setData(geojsonData);

        if (map.getLayer(layerId)) {
          map.setPaintProperty(layerId, 'line-width', lineWidth);
          map.setPaintProperty(layerId, 'line-opacity', lineOpacity);
          map.setPaintProperty(layerId, 'line-color', color);
        }
        if (map.getLayer(glowLayerId)) {
          map.setPaintProperty(glowLayerId, 'line-width', glowWidth);
          map.setPaintProperty(glowLayerId, 'line-opacity', glowOpacity);
          map.setPaintProperty(glowLayerId, 'line-color', color);
        }
      } else {
        map.addSource(sourceId, {
          type: 'geojson',
          data: geojsonData
        });

        // Glow Layer
        map.addLayer({
          id: glowLayerId,
          type: 'line',
          source: sourceId,
          layout: { 'line-join': 'round', 'line-cap': 'round' },
          paint: {
            'line-color': color,
            'line-width': glowWidth,
            'line-opacity': glowOpacity,
            'line-blur': 4
          }
        });

        // Main Route Layer
        map.addLayer({
          id: layerId,
          type: 'line',
          source: sourceId,
          layout: { 'line-join': 'round', 'line-cap': 'round' },
          paint: {
            'line-color': color,
            'line-width': lineWidth,
            'line-opacity': lineOpacity
          }
        });
      }
    });
  }, [routes, mapLoaded, riders, activeHighlightedRiderId]);

  // Sync Restaurant Markers
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapLoaded) return;

    restaurants.forEach(rest => {
      if (!restMarkersRef.current.has(rest.id)) {
        const el = document.createElement('div');
        const root = ReactDOM.createRoot(el);
        root.render(<RestaurantMarker restaurant={rest} />);

        const marker = new mapboxgl.Marker({ element: el })
          .setLngLat([rest.lng, rest.lat])
          .addTo(map);

        restMarkersRef.current.set(rest.id, { marker, root });
      }
    });
  }, [restaurants, mapLoaded]);

  // Sync Customer Markers
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapLoaded) return;

    customers.forEach(cust => {
      const order = orders.find(o => o.customerId === cust.id);
      let entry = custMarkersRef.current.get(cust.id);

      if (!entry) {
        const el = document.createElement('div');
        const root = ReactDOM.createRoot(el);
        root.render(
          <CustomerMarker
            customer={cust}
            order={order}
            onClick={() => order && setSelectedOrderId(order.id)}
          />
        );

        const marker = new mapboxgl.Marker({ element: el })
          .setLngLat([cust.lng, cust.lat])
          .addTo(map);

        custMarkersRef.current.set(cust.id, { marker, root });
      } else {
        entry.root.render(
          <CustomerMarker
            customer={cust}
            order={order}
            onClick={() => order && setSelectedOrderId(order.id)}
          />
        );
      }
    });
  }, [customers, orders, mapLoaded, setSelectedOrderId]);

  // Sync Rider Bike Markers (60fps position & rotation)
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapLoaded) return;

    riders.forEach(rider => {
      let entry = riderMarkersRef.current.get(rider.id);
      const isSelected = activeHighlightedRiderId === rider.id;

      if (!entry) {
        const el = document.createElement('div');
        const root = ReactDOM.createRoot(el);
        root.render(
          <RiderBikeMarker
            rider={rider}
            isSelected={isSelected}
            onClick={() => {
              setSelectedRiderId(rider.id);
              if (rider.assignedOrderIds.length > 0) {
                setSelectedOrderId(rider.assignedOrderIds[0]);
              }
            }}
          />
        );

        const marker = new mapboxgl.Marker({ element: el, rotationAlignment: 'map' })
          .setLngLat([rider.lng, rider.lat])
          .addTo(map);

        riderMarkersRef.current.set(rider.id, { marker, root });
      } else {
        entry.marker.setLngLat([rider.lng, rider.lat]);
        entry.root.render(
          <RiderBikeMarker
            rider={rider}
            isSelected={isSelected}
            onClick={() => {
              setSelectedRiderId(rider.id);
              if (rider.assignedOrderIds.length > 0) {
                setSelectedOrderId(rider.assignedOrderIds[0]);
              }
            }}
          />
        );
      }
    });
  }, [riders, activeHighlightedRiderId, mapLoaded, setSelectedRiderId, setSelectedOrderId]);

  // Camera pan on selection
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapLoaded) return;

    if (selectedOrderId) {
      const order = orders.find(o => o.id === selectedOrderId);
      if (order) {
        map.flyTo({
          center: [order.customerLocation.lng, order.customerLocation.lat],
          zoom: 13.8,
          speed: 1.0
        });
      }
    } else if (selectedRiderId) {
      const rider = riders.find(r => r.id === selectedRiderId);
      if (rider) {
        map.flyTo({
          center: [rider.lng, rider.lat],
          zoom: 13.8,
          speed: 1.0
        });
      }
    }
  }, [selectedOrderId, selectedRiderId, orders, riders, mapLoaded]);

  const handleZoomIn = () => mapRef.current?.zoomIn();
  const handleZoomOut = () => mapRef.current?.zoomOut();
  const handleResetCamera = () => {
    mapRef.current?.flyTo({
      center: [HYDERABAD_CENTER.lng, HYDERABAD_CENTER.lat],
      zoom: HYDERABAD_CENTER.zoom,
      pitch: 28,
      bearing: -5
    });
  };

  return (
    <div className={`relative w-full h-full overflow-hidden bg-[#090d16] select-none ${className}`}>
      {/* Mapbox Token Banner if missing */}
      {!hasToken && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-40 max-w-lg w-[90%] p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/40 backdrop-blur-md flex items-center gap-3 text-amber-200 text-xs shadow-2xl">
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
          <div className="flex-1">
            <span className="font-semibold block text-amber-300">Mapbox token not configured.</span>
            <span>Add <code className="bg-black/40 px-1.5 py-0.5 rounded font-mono text-amber-200">VITE_MAPBOX_TOKEN</code> to your <code className="bg-black/40 px-1.5 py-0.5 rounded font-mono text-amber-200">.env</code> file.</span>
          </div>
        </div>
      )}

      {/* Map Container */}
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* Top Left City Tag */}
      <div className="absolute top-4 left-4 z-20 flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#0b101c]/90 backdrop-blur-md border border-white/10 text-xs font-mono text-slate-300 shadow-md">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
        <span>HYDERABAD LOGISTICS CORRIDOR</span>
      </div>

      {/* Top Right Zoom Controls */}
      <div className="absolute top-4 right-4 z-20 flex flex-col gap-1.5">
        <button
          onClick={handleZoomIn}
          className="p-2 rounded-xl bg-[#0b101c]/90 backdrop-blur-md border border-white/10 text-slate-300 hover:text-white transition-all shadow-md"
          title="Zoom In"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={handleZoomOut}
          className="p-2 rounded-xl bg-[#0b101c]/90 backdrop-blur-md border border-white/10 text-slate-300 hover:text-white transition-all shadow-md"
          title="Zoom Out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button
          onClick={handleResetCamera}
          className="p-2 rounded-xl bg-[#0b101c]/90 backdrop-blur-md border border-white/10 text-slate-300 hover:text-white transition-all shadow-md"
          title="Reset Camera"
        >
          <Compass className="w-4 h-4" />
        </button>
      </div>

      {/* Minimal Legend */}
      <MapLegend />
    </div>
  );
};
