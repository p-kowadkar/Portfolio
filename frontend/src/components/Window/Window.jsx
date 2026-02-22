import { Rnd } from 'react-rnd';
import { motion } from 'framer-motion';

export default function Window({
  id,
  title,
  isOpen,
  isMinimized,
  isMaximized,
  zIndex,
  defaultPosition,
  defaultSize,
  onClose,
  onMinimize,
  onMaximize,
  onFocus,
  children,
}) {
  if (!isOpen || isMinimized) return null;

  const maxStyle = isMaximized
    ? { x: 0, y: 0, width: '100vw', height: 'calc(100vh - 80px)' }
    : null;

  return (
    <Rnd
      default={{
        x: defaultPosition.x,
        y: defaultPosition.y,
        width: defaultSize.width,
        height: defaultSize.height,
      }}
      position={maxStyle ? { x: 0, y: 0 } : undefined}
      size={
        maxStyle
          ? { width: window.innerWidth, height: window.innerHeight - 80 }
          : undefined
      }
      disableDragging={isMaximized}
      enableResizing={!isMaximized}
      minWidth={400}
      minHeight={300}
      dragHandleClassName="window-drag-handle"
      style={{ zIndex }}
      onMouseDown={() => onFocus(id)}
      bounds="parent"
    >
      <motion.div
        className="flex flex-col w-full h-full rounded-xl overflow-hidden"
        style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          boxShadow: '0 25px 60px rgba(0,0,0,0.6)',
          backdropFilter: 'blur(20px)',
        }}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
      >
        {/* Title bar */}
        <div
          className="window-drag-handle flex items-center h-7 px-3 shrink-0"
          style={{ background: '#2a2a2a' }}
        >
          {/* Traffic lights */}
          <div className="flex items-center gap-[6px]">
            <button
              onClick={(e) => { e.stopPropagation(); onClose(id); }}
              className="w-3 h-3 rounded-full hover:brightness-110 transition-all"
              style={{ background: '#E50914' }}
              title="Close"
            />
            <button
              onClick={(e) => { e.stopPropagation(); onMinimize(id); }}
              className="w-3 h-3 rounded-full hover:brightness-110 transition-all"
              style={{ background: '#f5a623' }}
              title="Minimize"
            />
            <button
              onClick={(e) => { e.stopPropagation(); onMaximize(id); }}
              className="w-3 h-3 rounded-full hover:brightness-110 transition-all"
              style={{ background: '#27c93f' }}
              title="Maximize"
            />
          </div>
          {/* Title */}
          <span
            className="absolute left-1/2 -translate-x-1/2 font-mono text-[11px]"
            style={{ color: 'var(--muted)' }}
          >
            {title}
          </span>
        </div>
        {/* Content */}
        <div className="flex-1 overflow-auto">{children}</div>
      </motion.div>
    </Rnd>
  );
}
