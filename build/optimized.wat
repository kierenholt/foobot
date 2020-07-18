(module
 (type $i32_=>_none (func (param i32)))
 (type $none_=>_none (func))
 (type $i32_i32_f32_=>_none (func (param i32 i32 f32)))
 (type $i32_i32_i32_=>_none (func (param i32 i32 i32)))
 (type $i32_i32_=>_none (func (param i32 i32)))
 (type $f32_=>_none (func (param f32)))
 (type $i32_i32_=>_f32 (func (param i32 i32) (result f32)))
 (type $i32_i32_=>_i32 (func (param i32 i32) (result i32)))
 (type $f64_=>_f64 (func (param f64) (result f64)))
 (type $i32_i32_i32_i32_=>_none (func (param i32 i32 i32 i32)))
 (type $i32_i32_i32_f32_=>_none (func (param i32 i32 i32 f32)))
 (type $i32_i32_f32_f32_f32_f32_=>_none (func (param i32 i32 f32 f32 f32 f32)))
 (type $none_=>_i32 (func (result i32)))
 (type $i32_=>_i32 (func (param i32) (result i32)))
 (type $i32_i32_i32_=>_i32 (func (param i32 i32 i32) (result i32)))
 (type $i64_=>_i32 (func (param i64) (result i32)))
 (import "env" "abort" (func $~lib/builtins/abort (param i32 i32 i32 i32)))
 (memory $0 1)
 (data (i32.const 1024) "\1e\00\00\00\01\00\00\00\01\00\00\00\1e\00\00\00~\00l\00i\00b\00/\00r\00t\00/\00t\00l\00s\00f\00.\00t\00s")
 (data (i32.const 1072) "(\00\00\00\01\00\00\00\01\00\00\00(\00\00\00a\00l\00l\00o\00c\00a\00t\00i\00o\00n\00 \00t\00o\00o\00 \00l\00a\00r\00g\00e")
 (data (i32.const 1136) "\1e\00\00\00\01\00\00\00\01\00\00\00\1e\00\00\00~\00l\00i\00b\00/\00r\00t\00/\00p\00u\00r\00e\00.\00t\00s")
 (data (i32.const 1184) "n\83\f9\a2\00\00\00\00\d1W\'\fc)\15DN\99\95b\db\c0\dd4\f5\abcQ\feA\90C<:n$\b7a\c5\bb\de\ea.I\06\e0\d2MB\1c\eb\1d\fe\1c\92\d1\t\f55\82\e8>\a7)\b1&p\9c\e9\84D\bb.9\d6\919A~_\b4\8b_\84\9c\f49S\83\ff\97\f8\1f;(\f9\bd\8b\11/\ef\0f\98\05\de\cf~6m\1fm\nZf?FO\b7\t\cb\'\c7\ba\'u-\ea_\9e\f79\07={\f1\e5\eb\b1_\fbk\ea\92R\8aF0\03V\08]\8d\1f \bc\cf\f0\abk{\fca\91\e3\a9\1d6\f4\9a_\85\99e\08\1b\e6^\80\d8\ff\8d@h\a0\14W\15\06\061\'sM")
 (data (i32.const 1376) "\03\00\00\00 \00\00\00\00\00\00\00 \00\00\00\00\00\00\00 ")
 (global $~lib/rt/tlsf/ROOT (mut i32) (i32.const 0))
 (global $~lib/rt/tlsf/collectLock (mut i32) (i32.const 0))
 (global $assembly/index/RIPPLE_IMAGE_PIXEL_WIDTH (mut i32) (i32.const 20))
 (global $assembly/index/RIPPLE_IMAGE_PIXEL_HEIGHT (mut i32) (i32.const 100))
 (global $assembly/index/RIPPLE_IMAGE_NUM_PIXELS (mut i32) (i32.const 0))
 (global $assembly/index/RIPPLE_IMAGE_MEM_SIZE (mut i32) (i32.const 0))
 (global $assembly/index/POSITION_MEM_SIZE (mut i32) (i32.const 0))
 (global $assembly/index/VELOCITY_MEM_SIZE (mut i32) (i32.const 0))
 (global $assembly/index/ABSORBERS_MEM_SIZE (mut i32) (i32.const 0))
 (global $assembly/index/N_SQUARED_MEM_SIZE (mut i32) (i32.const 0))
 (global $assembly/index/RIPPLE_IMAGE_MEM_START (mut i32) (i32.const 0))
 (global $assembly/index/currentPositionMemStart (mut i32) (i32.const 0))
 (global $assembly/index/prevPositionMemStart (mut i32) (i32.const 0))
 (global $assembly/index/VELOCITY_MEM_START (mut i32) (i32.const 0))
 (global $assembly/index/ABSORBER_MEM_START (mut i32) (i32.const 0))
 (global $assembly/index/N_SQUARED_MEM_START (mut i32) (i32.const 0))
 (global $assembly/index/oscillatorAmplitude (mut f32) (f32.const 2))
 (global $assembly/index/oscillatorV (mut f32) (f32.const 0))
 (global $assembly/index/FRAMES_PER_SECOND (mut i32) (i32.const 25))
 (global $assembly/index/TIMESTEPS_PER_FRAME i32 (i32.const 10))
 (global $assembly/index/FREQUENCY (mut f32) (f32.const 4))
 (global $assembly/index/OMEGA2 (mut f32) (f32.const 0))
 (global $assembly/index/SPEED (mut f32) (f32.const 0.20000000298023224))
 (global $assembly/index/SPEED_SQUARED (mut f32) (f32.const 0))
 (global $assembly/index/FRICTION (mut f32) (f32.const 0.009999999776482582))
 (global $assembly/index/HARD_BOUNDARY (mut i32) (i32.const 2))
 (global $assembly/index/HIGH_CONTRAST (mut i32) (i32.const 0))
 (global $assembly/index/MAX_AMPLITUDE (mut f32) (f32.const 1))
 (global $assembly/index/COLOUR (mut i32) (i32.const 2))
 (global $~lib/math/rempio2_y0 (mut f64) (f64.const 0))
 (global $~lib/math/rempio2_y1 (mut f64) (f64.const 0))
 (global $~lib/math/res128_hi (mut i64) (i64.const 0))
 (global $~lib/rt/__rtti_base i32 (i32.const 1376))
 (export "memory" (memory $0))
 (export "__alloc" (func $~lib/rt/tlsf/__alloc))
 (export "__retain" (func $~lib/rt/pure/__retain))
 (export "__release" (func $~lib/rt/pure/__release))
 (export "__collect" (func $~lib/rt/pure/__collect))
 (export "__rtti_base" (global $~lib/rt/__rtti_base))
 (export "RIPPLE_IMAGE_PIXEL_WIDTH" (global $assembly/index/RIPPLE_IMAGE_PIXEL_WIDTH))
 (export "RIPPLE_IMAGE_PIXEL_HEIGHT" (global $assembly/index/RIPPLE_IMAGE_PIXEL_HEIGHT))
 (export "RIPPLE_IMAGE_NUM_PIXELS" (global $assembly/index/RIPPLE_IMAGE_NUM_PIXELS))
 (export "RIPPLE_IMAGE_MEM_SIZE" (global $assembly/index/RIPPLE_IMAGE_MEM_SIZE))
 (export "POSITION_MEM_SIZE" (global $assembly/index/POSITION_MEM_SIZE))
 (export "VELOCITY_MEM_SIZE" (global $assembly/index/VELOCITY_MEM_SIZE))
 (export "ABSORBERS_MEM_SIZE" (global $assembly/index/ABSORBERS_MEM_SIZE))
 (export "N_SQUARED_MEM_SIZE" (global $assembly/index/N_SQUARED_MEM_SIZE))
 (export "RIPPLE_IMAGE_MEM_START" (global $assembly/index/RIPPLE_IMAGE_MEM_START))
 (export "VELOCITY_MEM_START" (global $assembly/index/VELOCITY_MEM_START))
 (export "ABSORBER_MEM_START" (global $assembly/index/ABSORBER_MEM_START))
 (export "N_SQUARED_MEM_START" (global $assembly/index/N_SQUARED_MEM_START))
 (export "init" (func $assembly/index/init))
 (export "timeStep" (func $assembly/index/timeStep))
 (export "disturbBall" (func $assembly/index/disturbBall))
 (export "disturbLine" (func $assembly/index/disturbLine))
 (export "setLineAbsorber" (func $assembly/index/setLineAbsorber))
 (export "setNrectangle" (func $assembly/index/setNrectangle))
 (export "setNSquared" (func $assembly/index/setNSquared))
 (export "setLineOscillator" (func $assembly/index/setLineOscillator))
 (export "setPointOscillator" (func $assembly/index/setPointOscillator))
 (export "resetAbsorbers" (func $assembly/index/resetAbsorbers))
 (export "resetNSquared" (func $assembly/index/resetNSquared))
 (export "FRAMES_PER_SECOND" (global $assembly/index/FRAMES_PER_SECOND))
 (export "TIMESTEPS_PER_FRAME" (global $assembly/index/TIMESTEPS_PER_FRAME))
 (export "FREQUENCY" (global $assembly/index/FREQUENCY))
 (export "setFrequency" (func $assembly/index/setFrequency))
 (export "setSpeed" (func $assembly/index/setSpeed))
 (export "setFriction" (func $assembly/index/setFriction))
 (export "setHardBoundary" (func $assembly/index/setHardBoundary))
 (export "setHighContrast" (func $assembly/index/setHighContrast))
 (export "setMaxAmplitude" (func $assembly/index/setMaxAmplitude))
 (export "setColour" (func $assembly/index/setColour))
 (export "SPEED" (global $assembly/index/SPEED))
 (export "FRICTION" (global $assembly/index/FRICTION))
 (export "HARD_BOUNDARY" (global $assembly/index/HARD_BOUNDARY))
 (export "HIGH_CONTRAST" (global $assembly/index/HIGH_CONTRAST))
 (export "MAX_AMPLITUDE" (global $assembly/index/MAX_AMPLITUDE))
 (export "COLOUR" (global $assembly/index/COLOUR))
 (start $~start)
 (func $~lib/rt/tlsf/removeBlock (param $0 i32) (param $1 i32)
  (local $2 i32)
  (local $3 i32)
  (local $4 i32)
  (local $5 i32)
  local.get $1
  i32.load
  local.tee $2
  i32.const 1
  i32.and
  i32.eqz
  if
   i32.const 0
   i32.const 1040
   i32.const 277
   i32.const 14
   call $~lib/builtins/abort
   unreachable
  end
  local.get $2
  i32.const -4
  i32.and
  local.tee $2
  i32.const 16
  i32.ge_u
  if (result i32)
   local.get $2
   i32.const 1073741808
   i32.lt_u
  else
   i32.const 0
  end
  i32.eqz
  if
   i32.const 0
   i32.const 1040
   i32.const 279
   i32.const 14
   call $~lib/builtins/abort
   unreachable
  end
  local.get $2
  i32.const 256
  i32.lt_u
  if
   local.get $2
   i32.const 4
   i32.shr_u
   local.set $2
  else
   local.get $2
   i32.const 31
   local.get $2
   i32.clz
   i32.sub
   local.tee $4
   i32.const 4
   i32.sub
   i32.shr_u
   i32.const 16
   i32.xor
   local.set $2
   local.get $4
   i32.const 7
   i32.sub
   local.set $4
  end
  local.get $2
  i32.const 16
  i32.lt_u
  i32.const 0
  local.get $4
  i32.const 23
  i32.lt_u
  select
  i32.eqz
  if
   i32.const 0
   i32.const 1040
   i32.const 292
   i32.const 14
   call $~lib/builtins/abort
   unreachable
  end
  local.get $1
  i32.load offset=20
  local.set $3
  local.get $1
  i32.load offset=16
  local.tee $5
  if
   local.get $5
   local.get $3
   i32.store offset=20
  end
  local.get $3
  if
   local.get $3
   local.get $5
   i32.store offset=16
  end
  local.get $1
  local.get $0
  local.get $2
  local.get $4
  i32.const 4
  i32.shl
  i32.add
  i32.const 2
  i32.shl
  i32.add
  i32.load offset=96
  i32.eq
  if
   local.get $0
   local.get $2
   local.get $4
   i32.const 4
   i32.shl
   i32.add
   i32.const 2
   i32.shl
   i32.add
   local.get $3
   i32.store offset=96
   local.get $3
   i32.eqz
   if
    local.get $0
    local.get $4
    i32.const 2
    i32.shl
    i32.add
    local.tee $3
    i32.load offset=4
    i32.const 1
    local.get $2
    i32.shl
    i32.const -1
    i32.xor
    i32.and
    local.set $1
    local.get $3
    local.get $1
    i32.store offset=4
    local.get $1
    i32.eqz
    if
     local.get $0
     local.get $0
     i32.load
     i32.const 1
     local.get $4
     i32.shl
     i32.const -1
     i32.xor
     i32.and
     i32.store
    end
   end
  end
 )
 (func $~lib/rt/tlsf/insertBlock (param $0 i32) (param $1 i32)
  (local $2 i32)
  (local $3 i32)
  (local $4 i32)
  (local $5 i32)
  (local $6 i32)
  (local $7 i32)
  (local $8 i32)
  local.get $1
  i32.eqz
  if
   i32.const 0
   i32.const 1040
   i32.const 205
   i32.const 14
   call $~lib/builtins/abort
   unreachable
  end
  local.get $1
  i32.load
  local.tee $3
  i32.const 1
  i32.and
  i32.eqz
  if
   i32.const 0
   i32.const 1040
   i32.const 207
   i32.const 14
   call $~lib/builtins/abort
   unreachable
  end
  local.get $1
  i32.const 16
  i32.add
  local.get $1
  i32.load
  i32.const -4
  i32.and
  i32.add
  local.tee $4
  i32.load
  local.tee $5
  i32.const 1
  i32.and
  if
   local.get $3
   i32.const -4
   i32.and
   i32.const 16
   i32.add
   local.get $5
   i32.const -4
   i32.and
   i32.add
   local.tee $2
   i32.const 1073741808
   i32.lt_u
   if
    local.get $0
    local.get $4
    call $~lib/rt/tlsf/removeBlock
    local.get $1
    local.get $2
    local.get $3
    i32.const 3
    i32.and
    i32.or
    local.tee $3
    i32.store
    local.get $1
    i32.const 16
    i32.add
    local.get $1
    i32.load
    i32.const -4
    i32.and
    i32.add
    local.tee $4
    i32.load
    local.set $5
   end
  end
  local.get $3
  i32.const 2
  i32.and
  if
   local.get $1
   i32.const 4
   i32.sub
   i32.load
   local.tee $2
   i32.load
   local.tee $7
   i32.const 1
   i32.and
   i32.eqz
   if
    i32.const 0
    i32.const 1040
    i32.const 228
    i32.const 16
    call $~lib/builtins/abort
    unreachable
   end
   local.get $7
   i32.const -4
   i32.and
   i32.const 16
   i32.add
   local.get $3
   i32.const -4
   i32.and
   i32.add
   local.tee $8
   i32.const 1073741808
   i32.lt_u
   if
    local.get $0
    local.get $2
    call $~lib/rt/tlsf/removeBlock
    local.get $2
    local.get $8
    local.get $7
    i32.const 3
    i32.and
    i32.or
    local.tee $3
    i32.store
    local.get $2
    local.set $1
   end
  end
  local.get $4
  local.get $5
  i32.const 2
  i32.or
  i32.store
  local.get $3
  i32.const -4
  i32.and
  local.tee $2
  i32.const 16
  i32.ge_u
  if (result i32)
   local.get $2
   i32.const 1073741808
   i32.lt_u
  else
   i32.const 0
  end
  i32.eqz
  if
   i32.const 0
   i32.const 1040
   i32.const 243
   i32.const 14
   call $~lib/builtins/abort
   unreachable
  end
  local.get $2
  local.get $1
  i32.const 16
  i32.add
  i32.add
  local.get $4
  i32.ne
  if
   i32.const 0
   i32.const 1040
   i32.const 244
   i32.const 14
   call $~lib/builtins/abort
   unreachable
  end
  local.get $4
  i32.const 4
  i32.sub
  local.get $1
  i32.store
  local.get $2
  i32.const 256
  i32.lt_u
  if
   local.get $2
   i32.const 4
   i32.shr_u
   local.set $2
  else
   local.get $2
   i32.const 31
   local.get $2
   i32.clz
   i32.sub
   local.tee $3
   i32.const 4
   i32.sub
   i32.shr_u
   i32.const 16
   i32.xor
   local.set $2
   local.get $3
   i32.const 7
   i32.sub
   local.set $6
  end
  local.get $2
  i32.const 16
  i32.lt_u
  i32.const 0
  local.get $6
  i32.const 23
  i32.lt_u
  select
  i32.eqz
  if
   i32.const 0
   i32.const 1040
   i32.const 260
   i32.const 14
   call $~lib/builtins/abort
   unreachable
  end
  local.get $0
  local.get $2
  local.get $6
  i32.const 4
  i32.shl
  i32.add
  i32.const 2
  i32.shl
  i32.add
  i32.load offset=96
  local.set $3
  local.get $1
  i32.const 0
  i32.store offset=16
  local.get $1
  local.get $3
  i32.store offset=20
  local.get $3
  if
   local.get $3
   local.get $1
   i32.store offset=16
  end
  local.get $0
  local.get $2
  local.get $6
  i32.const 4
  i32.shl
  i32.add
  i32.const 2
  i32.shl
  i32.add
  local.get $1
  i32.store offset=96
  local.get $0
  local.get $0
  i32.load
  i32.const 1
  local.get $6
  i32.shl
  i32.or
  i32.store
  local.get $0
  local.get $6
  i32.const 2
  i32.shl
  i32.add
  local.tee $0
  local.get $0
  i32.load offset=4
  i32.const 1
  local.get $2
  i32.shl
  i32.or
  i32.store offset=4
 )
 (func $~lib/rt/tlsf/addMemory (param $0 i32) (param $1 i32) (param $2 i32)
  (local $3 i32)
  (local $4 i32)
  local.get $2
  i32.const 15
  i32.and
  i32.eqz
  i32.const 0
  local.get $1
  i32.const 15
  i32.and
  i32.eqz
  i32.const 0
  local.get $1
  local.get $2
  i32.le_u
  select
  select
  i32.eqz
  if
   i32.const 0
   i32.const 1040
   i32.const 386
   i32.const 5
   call $~lib/builtins/abort
   unreachable
  end
  local.get $0
  i32.load offset=1568
  local.tee $3
  if
   local.get $1
   local.get $3
   i32.const 16
   i32.add
   i32.lt_u
   if
    i32.const 0
    i32.const 1040
    i32.const 396
    i32.const 16
    call $~lib/builtins/abort
    unreachable
   end
   local.get $3
   local.get $1
   i32.const 16
   i32.sub
   i32.eq
   if
    local.get $3
    i32.load
    local.set $4
    local.get $1
    i32.const 16
    i32.sub
    local.set $1
   end
  else
   local.get $1
   local.get $0
   i32.const 1572
   i32.add
   i32.lt_u
   if
    i32.const 0
    i32.const 1040
    i32.const 408
    i32.const 5
    call $~lib/builtins/abort
    unreachable
   end
  end
  local.get $2
  local.get $1
  i32.sub
  local.tee $2
  i32.const 48
  i32.lt_u
  if
   return
  end
  local.get $1
  local.get $4
  i32.const 2
  i32.and
  local.get $2
  i32.const 32
  i32.sub
  i32.const 1
  i32.or
  i32.or
  i32.store
  local.get $1
  i32.const 0
  i32.store offset=16
  local.get $1
  i32.const 0
  i32.store offset=20
  local.get $1
  local.get $2
  i32.add
  i32.const 16
  i32.sub
  local.tee $2
  i32.const 2
  i32.store
  local.get $0
  local.get $2
  i32.store offset=1568
  local.get $0
  local.get $1
  call $~lib/rt/tlsf/insertBlock
 )
 (func $~lib/rt/tlsf/maybeInitialize (result i32)
  (local $0 i32)
  (local $1 i32)
  (local $2 i32)
  global.get $~lib/rt/tlsf/ROOT
  local.tee $0
  i32.eqz
  if
   i32.const 1
   memory.size
   local.tee $0
   i32.gt_s
   if (result i32)
    i32.const 1
    local.get $0
    i32.sub
    memory.grow
    i32.const 0
    i32.lt_s
   else
    i32.const 0
   end
   if
    unreachable
   end
   i32.const 1408
   local.tee $0
   i32.const 0
   i32.store
   i32.const 2976
   i32.const 0
   i32.store
   loop $for-loop|0
    local.get $1
    i32.const 23
    i32.lt_u
    if
     local.get $1
     i32.const 2
     i32.shl
     i32.const 1408
     i32.add
     i32.const 0
     i32.store offset=4
     i32.const 0
     local.set $2
     loop $for-loop|1
      local.get $2
      i32.const 16
      i32.lt_u
      if
       local.get $1
       i32.const 4
       i32.shl
       local.get $2
       i32.add
       i32.const 2
       i32.shl
       i32.const 1408
       i32.add
       i32.const 0
       i32.store offset=96
       local.get $2
       i32.const 1
       i32.add
       local.set $2
       br $for-loop|1
      end
     end
     local.get $1
     i32.const 1
     i32.add
     local.set $1
     br $for-loop|0
    end
   end
   i32.const 1408
   i32.const 2992
   memory.size
   i32.const 16
   i32.shl
   call $~lib/rt/tlsf/addMemory
   i32.const 1408
   global.set $~lib/rt/tlsf/ROOT
  end
  local.get $0
 )
 (func $~lib/rt/tlsf/searchBlock (param $0 i32) (param $1 i32) (result i32)
  (local $2 i32)
  local.get $1
  i32.const 256
  i32.lt_u
  if
   local.get $1
   i32.const 4
   i32.shr_u
   local.set $1
  else
   local.get $1
   i32.const 536870904
   i32.lt_u
   if
    local.get $1
    i32.const 1
    i32.const 27
    local.get $1
    i32.clz
    i32.sub
    i32.shl
    i32.add
    i32.const 1
    i32.sub
    local.set $1
   end
   local.get $1
   i32.const 31
   local.get $1
   i32.clz
   i32.sub
   local.tee $2
   i32.const 4
   i32.sub
   i32.shr_u
   i32.const 16
   i32.xor
   local.set $1
   local.get $2
   i32.const 7
   i32.sub
   local.set $2
  end
  local.get $1
  i32.const 16
  i32.lt_u
  i32.const 0
  local.get $2
  i32.const 23
  i32.lt_u
  select
  i32.eqz
  if
   i32.const 0
   i32.const 1040
   i32.const 338
   i32.const 14
   call $~lib/builtins/abort
   unreachable
  end
  local.get $0
  local.get $2
  i32.const 2
  i32.shl
  i32.add
  i32.load offset=4
  i32.const -1
  local.get $1
  i32.shl
  i32.and
  local.tee $1
  if (result i32)
   local.get $0
   local.get $1
   i32.ctz
   local.get $2
   i32.const 4
   i32.shl
   i32.add
   i32.const 2
   i32.shl
   i32.add
   i32.load offset=96
  else
   local.get $0
   i32.load
   i32.const -1
   local.get $2
   i32.const 1
   i32.add
   i32.shl
   i32.and
   local.tee $1
   if (result i32)
    local.get $0
    local.get $1
    i32.ctz
    local.tee $1
    i32.const 2
    i32.shl
    i32.add
    i32.load offset=4
    local.tee $2
    i32.eqz
    if
     i32.const 0
     i32.const 1040
     i32.const 351
     i32.const 18
     call $~lib/builtins/abort
     unreachable
    end
    local.get $0
    local.get $2
    i32.ctz
    local.get $1
    i32.const 4
    i32.shl
    i32.add
    i32.const 2
    i32.shl
    i32.add
    i32.load offset=96
   else
    i32.const 0
   end
  end
 )
 (func $~lib/rt/tlsf/prepareBlock (param $0 i32) (param $1 i32) (param $2 i32)
  (local $3 i32)
  (local $4 i32)
  local.get $1
  i32.load
  local.set $3
  local.get $2
  i32.const 15
  i32.and
  if
   i32.const 0
   i32.const 1040
   i32.const 365
   i32.const 14
   call $~lib/builtins/abort
   unreachable
  end
  local.get $3
  i32.const -4
  i32.and
  local.get $2
  i32.sub
  local.tee $4
  i32.const 32
  i32.ge_u
  if
   local.get $1
   local.get $2
   local.get $3
   i32.const 2
   i32.and
   i32.or
   i32.store
   local.get $2
   local.get $1
   i32.const 16
   i32.add
   i32.add
   local.tee $1
   local.get $4
   i32.const 16
   i32.sub
   i32.const 1
   i32.or
   i32.store
   local.get $0
   local.get $1
   call $~lib/rt/tlsf/insertBlock
  else
   local.get $1
   local.get $3
   i32.const -2
   i32.and
   i32.store
   local.get $1
   i32.const 16
   i32.add
   local.tee $0
   local.get $1
   i32.load
   i32.const -4
   i32.and
   i32.add
   local.get $0
   local.get $1
   i32.load
   i32.const -4
   i32.and
   i32.add
   i32.load
   i32.const -3
   i32.and
   i32.store
  end
 )
 (func $~lib/rt/tlsf/allocateBlock (param $0 i32) (param $1 i32) (param $2 i32) (result i32)
  (local $3 i32)
  (local $4 i32)
  (local $5 i32)
  global.get $~lib/rt/tlsf/collectLock
  if
   i32.const 0
   i32.const 1040
   i32.const 500
   i32.const 14
   call $~lib/builtins/abort
   unreachable
  end
  local.get $1
  i32.const 1073741808
  i32.ge_u
  if
   i32.const 1088
   i32.const 1040
   i32.const 461
   i32.const 30
   call $~lib/builtins/abort
   unreachable
  end
  local.get $0
  local.get $1
  i32.const 15
  i32.add
  i32.const -16
  i32.and
  local.tee $3
  i32.const 16
  local.get $3
  i32.const 16
  i32.gt_u
  select
  local.tee $4
  call $~lib/rt/tlsf/searchBlock
  local.tee $3
  i32.eqz
  if
   i32.const 1
   global.set $~lib/rt/tlsf/collectLock
   i32.const 0
   global.set $~lib/rt/tlsf/collectLock
   local.get $0
   local.get $4
   call $~lib/rt/tlsf/searchBlock
   local.tee $3
   i32.eqz
   if
    i32.const 16
    memory.size
    local.tee $3
    i32.const 16
    i32.shl
    i32.const 16
    i32.sub
    local.get $0
    i32.load offset=1568
    i32.ne
    i32.shl
    local.get $4
    i32.const 1
    i32.const 27
    local.get $4
    i32.clz
    i32.sub
    i32.shl
    i32.const 1
    i32.sub
    i32.add
    local.get $4
    local.get $4
    i32.const 536870904
    i32.lt_u
    select
    i32.add
    i32.const 65535
    i32.add
    i32.const -65536
    i32.and
    i32.const 16
    i32.shr_u
    local.set $5
    local.get $3
    local.get $5
    local.get $3
    local.get $5
    i32.gt_s
    select
    memory.grow
    i32.const 0
    i32.lt_s
    if
     local.get $5
     memory.grow
     i32.const 0
     i32.lt_s
     if
      unreachable
     end
    end
    local.get $0
    local.get $3
    i32.const 16
    i32.shl
    memory.size
    i32.const 16
    i32.shl
    call $~lib/rt/tlsf/addMemory
    local.get $0
    local.get $4
    call $~lib/rt/tlsf/searchBlock
    local.tee $3
    i32.eqz
    if
     i32.const 0
     i32.const 1040
     i32.const 512
     i32.const 20
     call $~lib/builtins/abort
     unreachable
    end
   end
  end
  local.get $3
  i32.load
  i32.const -4
  i32.and
  local.get $4
  i32.lt_u
  if
   i32.const 0
   i32.const 1040
   i32.const 520
   i32.const 14
   call $~lib/builtins/abort
   unreachable
  end
  local.get $3
  i32.const 0
  i32.store offset=4
  local.get $3
  local.get $2
  i32.store offset=8
  local.get $3
  local.get $1
  i32.store offset=12
  local.get $0
  local.get $3
  call $~lib/rt/tlsf/removeBlock
  local.get $0
  local.get $3
  local.get $4
  call $~lib/rt/tlsf/prepareBlock
  local.get $3
 )
 (func $~lib/rt/tlsf/__alloc (param $0 i32) (param $1 i32) (result i32)
  call $~lib/rt/tlsf/maybeInitialize
  local.get $0
  local.get $1
  call $~lib/rt/tlsf/allocateBlock
  i32.const 16
  i32.add
 )
 (func $~lib/rt/pure/__retain (param $0 i32) (result i32)
  (local $1 i32)
  (local $2 i32)
  local.get $0
  i32.const 1404
  i32.gt_u
  if
   local.get $0
   i32.const 16
   i32.sub
   local.tee $1
   i32.load offset=4
   local.tee $2
   i32.const -268435456
   i32.and
   local.get $2
   i32.const 1
   i32.add
   i32.const -268435456
   i32.and
   i32.ne
   if
    i32.const 0
    i32.const 1152
    i32.const 109
    i32.const 3
    call $~lib/builtins/abort
    unreachable
   end
   local.get $1
   local.get $2
   i32.const 1
   i32.add
   i32.store offset=4
   local.get $1
   i32.load
   i32.const 1
   i32.and
   if
    i32.const 0
    i32.const 1152
    i32.const 112
    i32.const 14
    call $~lib/builtins/abort
    unreachable
   end
  end
  local.get $0
 )
 (func $~lib/rt/pure/__release (param $0 i32)
  local.get $0
  i32.const 1404
  i32.gt_u
  if
   local.get $0
   i32.const 16
   i32.sub
   call $~lib/rt/pure/decrement
  end
 )
 (func $~lib/memory/memory.copy (param $0 i32)
  (local $1 i32)
  (local $2 i32)
  (local $3 i32)
  (local $4 i32)
  i32.const 4
  local.set $4
  block $~lib/util/memory/memmove|inlined.0
   local.get $0
   i32.eqz
   br_if $~lib/util/memory/memmove|inlined.0
   local.get $0
   i32.const 0
   i32.lt_u
   if
    local.get $0
    i32.const 7
    i32.and
    i32.eqz
    if
     loop $while-continue|0
      local.get $0
      i32.const 7
      i32.and
      if
       local.get $4
       i32.eqz
       br_if $~lib/util/memory/memmove|inlined.0
       local.get $4
       i32.const 1
       i32.sub
       local.set $4
       local.get $0
       local.tee $2
       i32.const 1
       i32.add
       local.set $0
       local.get $1
       local.tee $3
       i32.const 1
       i32.add
       local.set $1
       local.get $2
       local.get $3
       i32.load8_u
       i32.store8
       br $while-continue|0
      end
     end
     loop $while-continue|1
      local.get $4
      i32.const 8
      i32.ge_u
      if
       local.get $0
       local.get $1
       i64.load
       i64.store
       local.get $4
       i32.const 8
       i32.sub
       local.set $4
       local.get $0
       i32.const 8
       i32.add
       local.set $0
       local.get $1
       i32.const 8
       i32.add
       local.set $1
       br $while-continue|1
      end
     end
    end
    loop $while-continue|2
     local.get $4
     if
      local.get $0
      local.tee $2
      i32.const 1
      i32.add
      local.set $0
      local.get $1
      local.tee $3
      i32.const 1
      i32.add
      local.set $1
      local.get $2
      local.get $3
      i32.load8_u
      i32.store8
      local.get $4
      i32.const 1
      i32.sub
      local.set $4
      br $while-continue|2
     end
    end
   else
    local.get $0
    i32.const 7
    i32.and
    i32.eqz
    if
     loop $while-continue|3
      local.get $0
      local.get $4
      i32.add
      i32.const 7
      i32.and
      if
       local.get $4
       i32.eqz
       br_if $~lib/util/memory/memmove|inlined.0
       local.get $0
       local.get $4
       i32.const 1
       i32.sub
       local.tee $4
       i32.add
       local.get $4
       i32.load8_u
       i32.store8
       br $while-continue|3
      end
     end
     loop $while-continue|4
      local.get $4
      i32.const 8
      i32.ge_u
      if
       local.get $0
       local.get $4
       i32.const 8
       i32.sub
       local.tee $4
       i32.add
       local.get $4
       i64.load
       i64.store
       br $while-continue|4
      end
     end
    end
    loop $while-continue|5
     local.get $4
     if
      local.get $0
      local.get $4
      i32.const 1
      i32.sub
      local.tee $4
      i32.add
      local.get $4
      i32.load8_u
      i32.store8
      br $while-continue|5
     end
    end
   end
  end
 )
 (func $assembly/index/setAbsorberType (param $0 i32) (param $1 i32) (param $2 i32)
  global.get $assembly/index/ABSORBER_MEM_START
  local.get $0
  local.get $1
  global.get $assembly/index/RIPPLE_IMAGE_PIXEL_WIDTH
  i32.mul
  i32.add
  i32.add
  local.get $2
  i32.store8
 )
 (func $assembly/index/setVelocity (param $0 i32) (param $1 i32) (param $2 f32)
  global.get $assembly/index/VELOCITY_MEM_START
  local.get $0
  i32.const 2
  i32.shl
  local.get $1
  global.get $assembly/index/RIPPLE_IMAGE_PIXEL_WIDTH
  i32.mul
  i32.const 2
  i32.shl
  i32.add
  i32.add
  local.get $2
  f32.store
 )
 (func $assembly/index/setNSquared (param $0 i32) (param $1 i32) (param $2 f32)
  global.get $assembly/index/N_SQUARED_MEM_START
  local.get $0
  i32.const 2
  i32.shl
  local.get $1
  global.get $assembly/index/RIPPLE_IMAGE_PIXEL_WIDTH
  i32.mul
  i32.const 2
  i32.shl
  i32.add
  i32.add
  local.get $2
  f32.store
 )
 (func $assembly/index/setBlack
  (local $0 i32)
  (local $1 i32)
  (local $2 i32)
  loop $for-loop|0
   local.get $1
   global.get $assembly/index/RIPPLE_IMAGE_PIXEL_WIDTH
   i32.lt_s
   if
    i32.const 0
    local.set $0
    loop $for-loop|1
     local.get $0
     global.get $assembly/index/RIPPLE_IMAGE_PIXEL_HEIGHT
     i32.lt_s
     if
      local.get $1
      i32.const 2
      i32.shl
      local.tee $2
      local.get $0
      global.get $assembly/index/RIPPLE_IMAGE_PIXEL_WIDTH
      i32.mul
      i32.const 2
      i32.shl
      i32.add
      i32.const 0
      i32.store8
      local.get $2
      local.get $0
      global.get $assembly/index/RIPPLE_IMAGE_PIXEL_WIDTH
      i32.mul
      i32.const 2
      i32.shl
      i32.add
      i32.const 0
      i32.store8 offset=1
      local.get $2
      local.get $0
      global.get $assembly/index/RIPPLE_IMAGE_PIXEL_WIDTH
      i32.mul
      i32.const 2
      i32.shl
      i32.add
      i32.const 0
      i32.store8 offset=2
      local.get $0
      i32.const 1
      i32.add
      local.set $0
      br $for-loop|1
     end
    end
    local.get $1
    i32.const 1
    i32.add
    local.set $1
    br $for-loop|0
   end
  end
 )
 (func $assembly/index/init (param $0 i32) (param $1 i32)
  local.get $0
  global.set $assembly/index/RIPPLE_IMAGE_PIXEL_WIDTH
  local.get $1
  global.set $assembly/index/RIPPLE_IMAGE_PIXEL_HEIGHT
  global.get $assembly/index/RIPPLE_IMAGE_PIXEL_WIDTH
  global.get $assembly/index/RIPPLE_IMAGE_PIXEL_HEIGHT
  i32.mul
  global.set $assembly/index/RIPPLE_IMAGE_NUM_PIXELS
  global.get $assembly/index/RIPPLE_IMAGE_NUM_PIXELS
  i32.const 2
  i32.shl
  global.set $assembly/index/RIPPLE_IMAGE_MEM_SIZE
  global.get $assembly/index/RIPPLE_IMAGE_NUM_PIXELS
  i32.const 2
  i32.shl
  global.set $assembly/index/POSITION_MEM_SIZE
  global.get $assembly/index/RIPPLE_IMAGE_NUM_PIXELS
  i32.const 2
  i32.shl
  global.set $assembly/index/VELOCITY_MEM_SIZE
  global.get $assembly/index/RIPPLE_IMAGE_NUM_PIXELS
  global.set $assembly/index/ABSORBERS_MEM_SIZE
  global.get $assembly/index/RIPPLE_IMAGE_NUM_PIXELS
  i32.const 2
  i32.shl
  global.set $assembly/index/N_SQUARED_MEM_SIZE
  i32.const 0
  global.set $assembly/index/RIPPLE_IMAGE_MEM_START
  global.get $assembly/index/RIPPLE_IMAGE_MEM_SIZE
  global.set $assembly/index/currentPositionMemStart
  global.get $assembly/index/RIPPLE_IMAGE_MEM_SIZE
  global.get $assembly/index/POSITION_MEM_SIZE
  i32.add
  global.set $assembly/index/prevPositionMemStart
  global.get $assembly/index/RIPPLE_IMAGE_MEM_SIZE
  global.get $assembly/index/POSITION_MEM_SIZE
  i32.const 1
  i32.shl
  i32.add
  global.set $assembly/index/VELOCITY_MEM_START
  global.get $assembly/index/VELOCITY_MEM_START
  global.get $assembly/index/VELOCITY_MEM_SIZE
  i32.add
  global.set $assembly/index/ABSORBER_MEM_START
  global.get $assembly/index/ABSORBER_MEM_START
  global.get $assembly/index/ABSORBERS_MEM_SIZE
  i32.add
  global.set $assembly/index/N_SQUARED_MEM_START
  global.get $assembly/index/N_SQUARED_MEM_SIZE
  global.get $assembly/index/ABSORBERS_MEM_SIZE
  global.get $assembly/index/VELOCITY_MEM_SIZE
  global.get $assembly/index/RIPPLE_IMAGE_MEM_SIZE
  global.get $assembly/index/POSITION_MEM_SIZE
  i32.const 1
  i32.shl
  i32.add
  i32.add
  i32.add
  i32.add
  local.tee $0
  i32.const 64000
  i32.gt_s
  if
   local.get $0
   i32.const 64000
   i32.div_s
   f64.convert_i32_s
   f64.floor
   i32.trunc_f64_s
   memory.grow
   drop
  end
  i32.const 0
  i32.const 127
  i32.store8
  i32.const 1
  i32.const 127
  i32.store8
  i32.const 2
  i32.const 127
  i32.store8
  i32.const 3
  i32.const 255
  i32.store8
  i32.const 0
  local.set $0
  global.get $assembly/index/RIPPLE_IMAGE_NUM_PIXELS
  i32.const 1
  i32.sub
  i32.const 2
  i32.shl
  local.set $1
  loop $while-continue|0
   local.get $0
   local.get $1
   i32.lt_u
   if
    local.get $0
    i32.const 4
    i32.add
    call $~lib/memory/memory.copy
    local.get $0
    i32.const 4
    i32.add
    local.set $0
    br $while-continue|0
   end
  end
  i32.const 1
  local.set $0
  loop $for-loop|0
   local.get $0
   global.get $assembly/index/RIPPLE_IMAGE_PIXEL_HEIGHT
   i32.const 1
   i32.sub
   i32.lt_s
   if
    i32.const 1
    local.set $1
    loop $for-loop|1
     local.get $1
     global.get $assembly/index/RIPPLE_IMAGE_PIXEL_WIDTH
     i32.const 1
     i32.sub
     i32.lt_s
     if
      local.get $1
      local.get $0
      i32.const 0
      call $assembly/index/setAbsorberType
      local.get $1
      local.get $0
      f32.const 0
      call $assembly/index/setVelocity
      local.get $1
      local.get $0
      f32.const 1
      call $assembly/index/setNSquared
      local.get $1
      i32.const 1
      i32.add
      local.set $1
      br $for-loop|1
     end
    end
    local.get $0
    i32.const 1
    i32.add
    local.set $0
    br $for-loop|0
   end
  end
  call $assembly/index/setBlack
 )
 (func $assembly/index/getPrevPosition (param $0 i32) (param $1 i32) (result f32)
  global.get $assembly/index/prevPositionMemStart
  local.get $0
  i32.const 2
  i32.shl
  local.get $1
  global.get $assembly/index/RIPPLE_IMAGE_PIXEL_WIDTH
  i32.mul
  i32.const 2
  i32.shl
  i32.add
  i32.add
  f32.load
 )
 (func $assembly/index/getVelocity (param $0 i32) (param $1 i32) (result f32)
  global.get $assembly/index/VELOCITY_MEM_START
  local.get $0
  i32.const 2
  i32.shl
  local.get $1
  global.get $assembly/index/RIPPLE_IMAGE_PIXEL_WIDTH
  i32.mul
  i32.const 2
  i32.shl
  i32.add
  i32.add
  f32.load
 )
 (func $assembly/index/updateAbsorberPosition (param $0 i32) (param $1 i32) (param $2 i32)
  (local $3 f32)
  (local $4 i32)
  local.get $2
  i32.const 255
  i32.and
  i32.const 1
  i32.eq
  if
   local.get $0
   i32.const 1
   i32.sub
   local.tee $4
   local.get $1
   call $assembly/index/getPrevPosition
   local.get $4
   local.get $1
   call $assembly/index/getVelocity
   global.get $assembly/index/SPEED
   f32.div
   f32.const 1.3524999618530273
   f32.div
   f32.sub
   local.set $3
  end
  local.get $2
  i32.const 255
  i32.and
  i32.const 2
  i32.eq
  if
   local.get $0
   local.get $1
   i32.const 1
   i32.sub
   local.tee $4
   call $assembly/index/getPrevPosition
   local.get $0
   local.get $4
   call $assembly/index/getVelocity
   global.get $assembly/index/SPEED
   f32.div
   f32.const 1.3524999618530273
   f32.div
   f32.sub
   local.set $3
  end
  local.get $2
  i32.const 255
  i32.and
  i32.const 3
  i32.eq
  if
   local.get $0
   i32.const 1
   i32.add
   local.tee $4
   local.get $1
   call $assembly/index/getPrevPosition
   local.get $4
   local.get $1
   call $assembly/index/getVelocity
   global.get $assembly/index/SPEED
   f32.div
   f32.const 1.3524999618530273
   f32.div
   f32.sub
   local.set $3
  end
  local.get $2
  i32.const 255
  i32.and
  i32.const 4
  i32.eq
  if
   local.get $0
   local.get $1
   i32.const 1
   i32.add
   local.tee $2
   call $assembly/index/getPrevPosition
   local.get $0
   local.get $2
   call $assembly/index/getVelocity
   global.get $assembly/index/SPEED
   f32.div
   f32.const 1.3524999618530273
   f32.div
   f32.sub
   local.set $3
  end
  global.get $assembly/index/currentPositionMemStart
  local.get $0
  i32.const 2
  i32.shl
  global.get $assembly/index/RIPPLE_IMAGE_PIXEL_WIDTH
  local.get $1
  i32.mul
  i32.const 2
  i32.shl
  i32.add
  i32.add
  local.get $3
  f32.store
 )
 (func $assembly/index/getNSquared (param $0 i32) (param $1 i32) (result f32)
  global.get $assembly/index/N_SQUARED_MEM_START
  local.get $0
  i32.const 2
  i32.shl
  local.get $1
  global.get $assembly/index/RIPPLE_IMAGE_PIXEL_WIDTH
  i32.mul
  i32.const 2
  i32.shl
  i32.add
  i32.add
  f32.load
 )
 (func $assembly/index/writePositionToBitmap (param $0 i32) (param $1 i32) (param $2 f32)
  (local $3 i32)
  i32.const 0
  i32.const 255
  global.get $assembly/index/HIGH_CONTRAST
  if (result i32)
   local.get $2
   f32.const 0
   f32.gt
   if (result i32)
    local.get $2
    global.get $assembly/index/MAX_AMPLITUDE
    f32.div
    f32.sqrt
    f32.const 127
    f32.mul
    i32.trunc_f32_s
    i32.const 127
    i32.add
   else
    i32.const 127
    f64.const -1
    local.get $2
    f64.promote_f32
    f64.mul
    global.get $assembly/index/MAX_AMPLITUDE
    f64.promote_f32
    f64.div
    f64.sqrt
    f64.const 127
    f64.mul
    i32.trunc_f64_s
    i32.sub
   end
  else
   local.get $2
   f32.const 127
   f32.mul
   global.get $assembly/index/MAX_AMPLITUDE
   f32.div
   i32.trunc_f32_s
   i32.const 127
   i32.add
  end
  local.tee $3
  local.get $2
  global.get $assembly/index/MAX_AMPLITUDE
  f32.gt
  select
  local.tee $3
  local.get $2
  f32.const -1
  global.get $assembly/index/MAX_AMPLITUDE
  f32.mul
  f32.lt
  select
  local.set $3
  global.get $assembly/index/COLOUR
  i32.const 3
  i32.eq
  if
   local.get $0
   i32.const 2
   i32.shl
   local.tee $0
   local.get $1
   global.get $assembly/index/RIPPLE_IMAGE_PIXEL_WIDTH
   i32.mul
   i32.const 2
   i32.shl
   i32.add
   local.get $3
   i32.store8
   local.get $0
   local.get $1
   global.get $assembly/index/RIPPLE_IMAGE_PIXEL_WIDTH
   i32.mul
   i32.const 2
   i32.shl
   i32.add
   local.get $3
   i32.store8 offset=1
   local.get $0
   local.get $1
   global.get $assembly/index/RIPPLE_IMAGE_PIXEL_WIDTH
   i32.mul
   i32.const 2
   i32.shl
   i32.add
   local.get $3
   i32.store8 offset=2
  else
   global.get $assembly/index/COLOUR
   local.get $0
   i32.const 2
   i32.shl
   local.get $1
   global.get $assembly/index/RIPPLE_IMAGE_PIXEL_WIDTH
   i32.mul
   i32.const 2
   i32.shl
   i32.add
   i32.add
   local.get $3
   i32.store8
  end
 )
 (func $assembly/index/setPosition (param $0 i32) (param $1 i32) (param $2 f32)
  global.get $assembly/index/currentPositionMemStart
  local.get $0
  i32.const 2
  i32.shl
  local.get $1
  global.get $assembly/index/RIPPLE_IMAGE_PIXEL_WIDTH
  i32.mul
  i32.const 2
  i32.shl
  i32.add
  i32.add
  local.get $2
  f32.store
  local.get $0
  local.get $1
  local.get $2
  call $assembly/index/writePositionToBitmap
 )
 (func $assembly/index/timeStep
  (local $0 i32)
  (local $1 i32)
  (local $2 f32)
  (local $3 f32)
  (local $4 i32)
  (local $5 i32)
  (local $6 f32)
  (local $7 f32)
  (local $8 f32)
  (local $9 f32)
  loop $for-loop|0
   local.get $4
   i32.const 10
   i32.lt_s
   if
    i32.const 1
    local.set $0
    loop $for-loop|1
     local.get $0
     global.get $assembly/index/RIPPLE_IMAGE_PIXEL_HEIGHT
     i32.const 1
     i32.sub
     i32.lt_s
     if
      i32.const 1
      local.set $1
      loop $for-loop|2
       local.get $1
       global.get $assembly/index/RIPPLE_IMAGE_PIXEL_WIDTH
       i32.const 1
       i32.sub
       i32.lt_s
       if
        global.get $assembly/index/ABSORBER_MEM_START
        global.get $assembly/index/RIPPLE_IMAGE_PIXEL_WIDTH
        local.get $0
        i32.mul
        local.get $1
        i32.add
        i32.add
        i32.load8_s
        local.tee $5
        if
         local.get $5
         i32.const 5
         i32.eq
         if
          global.get $assembly/index/currentPositionMemStart
          local.get $1
          i32.const 2
          i32.shl
          global.get $assembly/index/RIPPLE_IMAGE_PIXEL_WIDTH
          local.get $0
          i32.mul
          i32.const 2
          i32.shl
          i32.add
          i32.add
          global.get $assembly/index/oscillatorAmplitude
          f32.store
         else
          local.get $1
          local.get $0
          local.get $5
          call $assembly/index/updateAbsorberPosition
         end
        else
         local.get $1
         i32.const 1
         i32.sub
         local.get $0
         call $assembly/index/getPrevPosition
         local.set $2
         local.get $1
         local.get $0
         call $assembly/index/getPrevPosition
         local.set $3
         local.get $1
         i32.const 1
         i32.add
         local.get $0
         call $assembly/index/getPrevPosition
         local.set $6
         local.get $1
         local.get $0
         i32.const 1
         i32.sub
         call $assembly/index/getPrevPosition
         local.set $7
         local.get $1
         local.get $0
         i32.const 1
         i32.add
         call $assembly/index/getPrevPosition
         local.set $8
         local.get $1
         local.get $0
         call $assembly/index/getNSquared
         local.set $9
         global.get $assembly/index/SPEED_SQUARED
         f32.const -4
         local.get $3
         f32.mul
         local.get $2
         f32.add
         local.get $6
         f32.add
         local.get $7
         f32.add
         local.get $8
         f32.add
         f32.mul
         local.get $9
         f32.div
         local.set $2
         local.get $1
         local.get $0
         call $assembly/index/getVelocity
         local.get $2
         f32.add
         local.set $2
         local.get $3
         f32.const 1
         global.get $assembly/index/FRICTION
         f32.sub
         f32.mul
         local.get $2
         f32.add
         local.set $3
         local.get $1
         local.get $0
         local.get $2
         call $assembly/index/setVelocity
         local.get $1
         local.get $0
         local.get $3
         call $assembly/index/setPosition
        end
        local.get $1
        i32.const 1
        i32.add
        local.set $1
        br $for-loop|2
       end
      end
      local.get $0
      i32.const 1
      i32.add
      local.set $0
      br $for-loop|1
     end
    end
    i32.const 1
    local.set $0
    loop $for-loop|3
     local.get $0
     global.get $assembly/index/RIPPLE_IMAGE_PIXEL_HEIGHT
     i32.const 1
     i32.sub
     i32.lt_s
     if
      global.get $assembly/index/HARD_BOUNDARY
      i32.eqz
      if
       i32.const 0
       local.get $0
       f32.const 0
       call $assembly/index/setPosition
      end
      global.get $assembly/index/HARD_BOUNDARY
      i32.const 1
      i32.eq
      if
       i32.const 0
       local.get $0
       i32.const 1
       local.get $0
       call $assembly/index/getPrevPosition
       call $assembly/index/setPosition
      end
      global.get $assembly/index/HARD_BOUNDARY
      i32.const 2
      i32.eq
      if
       i32.const 0
       local.get $0
       i32.const 1
       local.get $0
       call $assembly/index/getPrevPosition
       i32.const 1
       local.get $0
       call $assembly/index/getVelocity
       global.get $assembly/index/SPEED
       f32.div
       f32.const 1.3524999618530273
       f32.div
       f32.sub
       call $assembly/index/setPosition
      end
      local.get $0
      i32.const 1
      i32.add
      local.set $0
      br $for-loop|3
     end
    end
    i32.const 1
    local.set $0
    loop $for-loop|4
     local.get $0
     global.get $assembly/index/RIPPLE_IMAGE_PIXEL_HEIGHT
     i32.const 1
     i32.sub
     i32.lt_s
     if
      global.get $assembly/index/HARD_BOUNDARY
      i32.eqz
      if
       global.get $assembly/index/RIPPLE_IMAGE_PIXEL_WIDTH
       i32.const 1
       i32.sub
       local.get $0
       f32.const 0
       call $assembly/index/setPosition
      end
      global.get $assembly/index/HARD_BOUNDARY
      i32.const 1
      i32.eq
      if
       global.get $assembly/index/RIPPLE_IMAGE_PIXEL_WIDTH
       i32.const 1
       i32.sub
       local.get $0
       global.get $assembly/index/RIPPLE_IMAGE_PIXEL_WIDTH
       i32.const 2
       i32.sub
       local.get $0
       call $assembly/index/getPrevPosition
       call $assembly/index/setPosition
      end
      global.get $assembly/index/HARD_BOUNDARY
      i32.const 2
      i32.eq
      if
       global.get $assembly/index/RIPPLE_IMAGE_PIXEL_WIDTH
       i32.const 1
       i32.sub
       local.get $0
       global.get $assembly/index/RIPPLE_IMAGE_PIXEL_WIDTH
       i32.const 2
       i32.sub
       local.get $0
       call $assembly/index/getPrevPosition
       global.get $assembly/index/RIPPLE_IMAGE_PIXEL_WIDTH
       i32.const 2
       i32.sub
       local.get $0
       call $assembly/index/getVelocity
       global.get $assembly/index/SPEED
       f32.div
       f32.const 1.3524999618530273
       f32.div
       f32.sub
       call $assembly/index/setPosition
      end
      local.get $0
      i32.const 1
      i32.add
      local.set $0
      br $for-loop|4
     end
    end
    i32.const 1
    local.set $0
    loop $for-loop|5
     local.get $0
     global.get $assembly/index/RIPPLE_IMAGE_PIXEL_WIDTH
     i32.const 1
     i32.sub
     i32.lt_s
     if
      global.get $assembly/index/HARD_BOUNDARY
      i32.eqz
      if
       local.get $0
       i32.const 0
       f32.const 0
       call $assembly/index/setPosition
      end
      global.get $assembly/index/HARD_BOUNDARY
      i32.const 1
      i32.eq
      if
       local.get $0
       i32.const 0
       local.get $0
       i32.const 1
       call $assembly/index/getPrevPosition
       call $assembly/index/setPosition
      end
      global.get $assembly/index/HARD_BOUNDARY
      i32.const 2
      i32.eq
      if
       local.get $0
       i32.const 0
       local.get $0
       i32.const 1
       call $assembly/index/getPrevPosition
       local.get $0
       i32.const 1
       call $assembly/index/getVelocity
       global.get $assembly/index/SPEED
       f32.div
       f32.const 1.3524999618530273
       f32.div
       f32.sub
       call $assembly/index/setPosition
      end
      local.get $0
      i32.const 1
      i32.add
      local.set $0
      br $for-loop|5
     end
    end
    i32.const 1
    local.set $0
    loop $for-loop|6
     local.get $0
     global.get $assembly/index/RIPPLE_IMAGE_PIXEL_WIDTH
     i32.const 1
     i32.sub
     i32.lt_s
     if
      global.get $assembly/index/HARD_BOUNDARY
      i32.eqz
      if
       local.get $0
       global.get $assembly/index/RIPPLE_IMAGE_PIXEL_HEIGHT
       i32.const 1
       i32.sub
       f32.const 0
       call $assembly/index/setPosition
      end
      global.get $assembly/index/HARD_BOUNDARY
      i32.const 1
      i32.eq
      if
       local.get $0
       global.get $assembly/index/RIPPLE_IMAGE_PIXEL_HEIGHT
       i32.const 1
       i32.sub
       local.get $0
       global.get $assembly/index/RIPPLE_IMAGE_PIXEL_HEIGHT
       i32.const 2
       i32.sub
       call $assembly/index/getPrevPosition
       call $assembly/index/setPosition
      end
      global.get $assembly/index/HARD_BOUNDARY
      i32.const 2
      i32.eq
      if
       local.get $0
       global.get $assembly/index/RIPPLE_IMAGE_PIXEL_HEIGHT
       i32.const 1
       i32.sub
       local.get $0
       global.get $assembly/index/RIPPLE_IMAGE_PIXEL_HEIGHT
       i32.const 2
       i32.sub
       call $assembly/index/getPrevPosition
       local.get $0
       global.get $assembly/index/RIPPLE_IMAGE_PIXEL_HEIGHT
       i32.const 2
       i32.sub
       call $assembly/index/getVelocity
       global.get $assembly/index/SPEED
       f32.div
       f32.const 1.3524999618530273
       f32.div
       f32.sub
       call $assembly/index/setPosition
      end
      local.get $0
      i32.const 1
      i32.add
      local.set $0
      br $for-loop|6
     end
    end
    global.get $assembly/index/oscillatorAmplitude
    global.get $assembly/index/oscillatorV
    f32.add
    global.set $assembly/index/oscillatorAmplitude
    global.get $assembly/index/oscillatorV
    global.get $assembly/index/OMEGA2
    global.get $assembly/index/oscillatorAmplitude
    f32.mul
    f32.sub
    global.set $assembly/index/oscillatorV
    global.get $assembly/index/prevPositionMemStart
    global.get $assembly/index/currentPositionMemStart
    global.set $assembly/index/prevPositionMemStart
    global.set $assembly/index/currentPositionMemStart
    local.get $4
    i32.const 1
    i32.add
    local.set $4
    br $for-loop|0
   end
  end
 )
 (func $assembly/index/disturbPoint (param $0 i32) (param $1 i32) (param $2 f32)
  (local $3 i32)
  global.get $assembly/index/currentPositionMemStart
  local.get $0
  i32.const 2
  i32.shl
  local.tee $3
  local.get $1
  global.get $assembly/index/RIPPLE_IMAGE_PIXEL_WIDTH
  i32.mul
  i32.const 2
  i32.shl
  i32.add
  i32.add
  local.get $2
  f32.store
  global.get $assembly/index/prevPositionMemStart
  local.get $3
  local.get $1
  global.get $assembly/index/RIPPLE_IMAGE_PIXEL_WIDTH
  i32.mul
  i32.const 2
  i32.shl
  i32.add
  i32.add
  local.get $2
  f32.store
  local.get $0
  local.get $1
  local.get $2
  call $assembly/index/writePositionToBitmap
 )
 (func $assembly/index/disturbBall (param $0 i32) (param $1 i32) (param $2 i32) (param $3 f32)
  (local $4 i32)
  (local $5 i32)
  (local $6 i32)
  (local $7 f32)
  (local $8 i32)
  (local $9 i32)
  (local $10 f32)
  local.get $1
  local.get $2
  i32.sub
  local.tee $5
  i32.const 0
  local.get $5
  i32.const 0
  i32.gt_s
  select
  local.set $5
  local.get $1
  local.get $2
  i32.add
  local.set $8
  loop $for-loop|0
   local.get $5
   local.get $8
   global.get $assembly/index/RIPPLE_IMAGE_PIXEL_HEIGHT
   local.tee $4
   local.get $8
   local.get $4
   i32.lt_s
   select
   i32.lt_s
   if
    local.get $0
    local.get $2
    i32.sub
    local.tee $4
    i32.const 0
    local.get $4
    i32.const 0
    i32.gt_s
    select
    local.set $4
    local.get $0
    local.get $2
    i32.add
    local.set $9
    loop $for-loop|1
     local.get $4
     local.get $9
     global.get $assembly/index/RIPPLE_IMAGE_PIXEL_WIDTH
     local.tee $6
     local.get $9
     local.get $6
     i32.lt_s
     select
     i32.lt_s
     if
      local.get $0
      local.get $4
      i32.sub
      local.tee $6
      local.get $6
      i32.mul
      local.get $1
      local.get $5
      i32.sub
      local.tee $6
      local.get $6
      i32.mul
      i32.add
      f32.convert_i32_s
      local.tee $10
      local.get $2
      local.get $2
      i32.mul
      f32.convert_i32_s
      local.tee $7
      f32.lt
      if
       local.get $4
       local.get $5
       local.get $3
       local.get $7
       local.get $10
       f32.sub
       local.get $7
       f32.div
       local.tee $7
       f32.mul
       local.get $7
       f32.mul
       call $assembly/index/disturbPoint
      end
      local.get $4
      i32.const 1
      i32.add
      local.set $4
      br $for-loop|1
     end
    end
    local.get $5
    i32.const 1
    i32.add
    local.set $5
    br $for-loop|0
   end
  end
 )
 (func $assembly/index/disturbLine (param $0 i32) (param $1 i32) (param $2 f32)
  (local $3 i32)
  (local $4 i32)
  (local $5 i32)
  (local $6 f32)
  (local $7 i32)
  i32.const 1
  local.set $4
  loop $for-loop|0
   local.get $4
   global.get $assembly/index/RIPPLE_IMAGE_PIXEL_HEIGHT
   i32.const 1
   i32.sub
   i32.lt_s
   if
    local.get $0
    local.get $1
    i32.sub
    local.tee $3
    i32.const 0
    local.get $3
    i32.const 0
    i32.gt_s
    select
    local.set $3
    local.get $0
    local.get $1
    i32.add
    local.set $7
    loop $for-loop|1
     local.get $3
     local.get $7
     global.get $assembly/index/RIPPLE_IMAGE_PIXEL_WIDTH
     local.tee $5
     local.get $7
     local.get $5
     i32.lt_s
     select
     i32.lt_s
     if
      local.get $3
      local.get $4
      local.get $2
      local.get $1
      local.get $1
      i32.mul
      f32.convert_i32_s
      local.tee $6
      local.get $0
      local.get $3
      i32.sub
      local.tee $5
      local.get $5
      i32.mul
      f32.convert_i32_s
      f32.sub
      local.get $6
      f32.div
      local.tee $6
      f32.mul
      local.get $6
      f32.mul
      call $assembly/index/disturbPoint
      local.get $3
      i32.const 1
      i32.add
      local.set $3
      br $for-loop|1
     end
    end
    local.get $4
    i32.const 1
    i32.add
    local.set $4
    br $for-loop|0
   end
  end
 )
 (func $assembly/index/setLineAbsorber (param $0 i32) (param $1 i32) (param $2 i32)
  (local $3 i32)
  local.get $1
  i32.const 0
  local.get $1
  i32.const 0
  i32.gt_s
  select
  local.set $1
  loop $for-loop|0
   local.get $1
   local.get $2
   global.get $assembly/index/RIPPLE_IMAGE_PIXEL_HEIGHT
   i32.const 1
   i32.sub
   local.tee $3
   local.get $2
   local.get $3
   i32.lt_s
   select
   i32.le_s
   if
    local.get $0
    i32.const 1
    i32.sub
    local.get $1
    i32.const 1
    call $assembly/index/setAbsorberType
    local.get $0
    local.get $1
    i32.const 3
    call $assembly/index/setAbsorberType
    local.get $1
    i32.const 1
    i32.add
    local.set $1
    br $for-loop|0
   end
  end
 )
 (func $~lib/math/pio2_large_quot (param $0 i64) (result i32)
  (local $1 i64)
  (local $2 i64)
  (local $3 i64)
  (local $4 i64)
  (local $5 i64)
  (local $6 i64)
  (local $7 i32)
  (local $8 i64)
  (local $9 i64)
  (local $10 i64)
  (local $11 i64)
  (local $12 f64)
  local.get $0
  i64.const 9223372036854775807
  i64.and
  i64.const 52
  i64.shr_s
  i64.const 1045
  i64.sub
  local.tee $1
  i64.const 6
  i64.shr_s
  i32.wrap_i64
  i32.const 3
  i32.shl
  i32.const 1184
  i32.add
  local.tee $7
  i64.load
  local.set $6
  local.get $7
  i64.load offset=8
  local.set $3
  local.get $7
  i64.load offset=16
  local.set $4
  local.get $1
  i64.const 63
  i64.and
  local.tee $1
  i64.const 0
  i64.ne
  if
   local.get $6
   local.get $1
   i64.shl
   local.get $3
   i64.const 64
   local.get $1
   i64.sub
   local.tee $2
   i64.shr_u
   i64.or
   local.set $6
   local.get $3
   local.get $1
   i64.shl
   local.get $4
   local.get $2
   i64.shr_u
   i64.or
   local.set $3
   local.get $4
   local.get $1
   i64.shl
   local.get $7
   i64.load offset=24
   local.get $2
   i64.shr_u
   i64.or
   local.set $4
  end
  local.get $0
  i64.const 4503599627370495
  i64.and
  i64.const 4503599627370496
  i64.or
  local.tee $1
  i64.const 4294967295
  i64.and
  local.tee $2
  local.get $3
  i64.const 32
  i64.shr_u
  local.tee $8
  i64.mul
  local.get $3
  i64.const 4294967295
  i64.and
  local.tee $5
  local.get $2
  i64.mul
  local.tee $9
  i64.const 32
  i64.shr_u
  i64.add
  local.set $3
  local.get $5
  local.get $1
  i64.const 32
  i64.shr_u
  local.tee $5
  i64.mul
  local.get $3
  i64.const 4294967295
  i64.and
  i64.add
  local.set $2
  local.get $5
  local.get $8
  i64.mul
  local.get $3
  i64.const 32
  i64.shr_u
  i64.add
  local.get $2
  i64.const 32
  i64.shr_u
  i64.add
  global.set $~lib/math/res128_hi
  global.get $~lib/math/res128_hi
  local.get $1
  local.get $6
  i64.mul
  i64.add
  local.get $4
  i64.const 32
  i64.shr_u
  local.get $1
  i64.const 32
  i64.shr_s
  i64.mul
  local.tee $3
  local.get $9
  i64.const 4294967295
  i64.and
  local.get $2
  i64.const 32
  i64.shl
  i64.add
  i64.add
  local.tee $1
  local.get $3
  i64.lt_u
  i64.extend_i32_u
  i64.add
  local.tee $8
  i64.const 2
  i64.shl
  local.get $1
  i64.const 62
  i64.shr_u
  i64.or
  local.tee $6
  i64.const 63
  i64.shr_s
  local.tee $4
  i64.const 1
  i64.shr_s
  local.get $6
  i64.xor
  local.tee $2
  i64.clz
  local.set $3
  local.get $2
  local.get $3
  i64.shl
  local.get $4
  local.get $1
  i64.const 2
  i64.shl
  i64.xor
  local.tee $5
  i64.const 64
  local.get $3
  i64.sub
  i64.shr_u
  i64.or
  local.tee $1
  i64.const 4294967295
  i64.and
  local.set $2
  local.get $1
  i64.const 32
  i64.shr_u
  local.tee $9
  i64.const 560513588
  i64.mul
  local.get $2
  i64.const 3373259426
  i64.mul
  local.get $2
  i64.const 560513588
  i64.mul
  local.tee $10
  i64.const 32
  i64.shr_u
  i64.add
  local.tee $11
  i64.const 4294967295
  i64.and
  i64.add
  local.set $2
  local.get $9
  i64.const 3373259426
  i64.mul
  local.get $11
  i64.const 32
  i64.shr_u
  i64.add
  local.get $2
  i64.const 32
  i64.shr_u
  i64.add
  global.set $~lib/math/res128_hi
  local.get $10
  i64.const 4294967295
  i64.and
  local.get $2
  i64.const 32
  i64.shl
  i64.add
  local.tee $2
  f64.const 3.753184150245214e-04
  local.get $1
  f64.convert_i64_u
  f64.mul
  f64.const 3.834951969714103e-04
  local.get $5
  local.get $3
  i64.shl
  f64.convert_i64_u
  f64.mul
  f64.add
  i64.trunc_f64_u
  local.tee $1
  i64.lt_u
  i64.extend_i32_u
  global.get $~lib/math/res128_hi
  local.tee $5
  i64.const 11
  i64.shr_u
  i64.add
  f64.convert_i64_u
  global.set $~lib/math/rempio2_y0
  f64.const 5.421010862427522e-20
  local.get $1
  local.get $5
  i64.const 53
  i64.shl
  local.get $2
  i64.const 11
  i64.shr_u
  i64.or
  i64.add
  f64.convert_i64_u
  f64.mul
  global.set $~lib/math/rempio2_y1
  global.get $~lib/math/rempio2_y0
  i64.const 4372995238176751616
  local.get $3
  i64.const 52
  i64.shl
  i64.sub
  local.get $0
  local.get $6
  i64.xor
  i64.const -9223372036854775808
  i64.and
  i64.or
  f64.reinterpret_i64
  local.tee $12
  f64.mul
  global.set $~lib/math/rempio2_y0
  global.get $~lib/math/rempio2_y1
  local.get $12
  f64.mul
  global.set $~lib/math/rempio2_y1
  local.get $8
  i64.const 62
  i64.shr_s
  local.get $4
  i64.sub
  i32.wrap_i64
 )
 (func $~lib/math/NativeMath.cos (param $0 f64) (result f64)
  (local $1 f64)
  (local $2 i64)
  (local $3 f64)
  (local $4 f64)
  (local $5 i32)
  (local $6 i32)
  (local $7 f64)
  local.get $0
  i64.reinterpret_f64
  local.tee $2
  i64.const 32
  i64.shr_u
  i32.wrap_i64
  local.tee $5
  i32.const 31
  i32.shr_u
  local.set $6
  local.get $5
  i32.const 2147483647
  i32.and
  local.tee $5
  i32.const 1072243195
  i32.le_u
  if
   local.get $5
   i32.const 1044816030
   i32.lt_u
   if
    f64.const 1
    return
   end
   f64.const 1
   f64.const 0.5
   local.get $0
   local.get $0
   f64.mul
   local.tee $3
   f64.mul
   local.tee $4
   f64.sub
   local.tee $1
   f64.const 1
   local.get $1
   f64.sub
   local.get $4
   f64.sub
   local.get $3
   local.get $3
   f64.const 0.0416666666666666
   local.get $3
   f64.const -0.001388888888887411
   local.get $3
   f64.const 2.480158728947673e-05
   f64.mul
   f64.add
   f64.mul
   f64.add
   f64.mul
   local.get $3
   local.get $3
   f64.mul
   local.tee $4
   local.get $4
   f64.mul
   f64.const -2.7557314351390663e-07
   local.get $3
   f64.const 2.087572321298175e-09
   local.get $3
   f64.const -1.1359647557788195e-11
   f64.mul
   f64.add
   f64.mul
   f64.add
   f64.mul
   f64.add
   f64.mul
   local.get $0
   f64.const 0
   f64.mul
   f64.sub
   f64.add
   f64.add
   return
  end
  local.get $5
  i32.const 2146435072
  i32.ge_u
  if
   local.get $0
   local.get $0
   f64.sub
   return
  end
  block $~lib/math/rempio2|inlined.0 (result i32)
   local.get $2
   i64.const 32
   i64.shr_u
   i32.wrap_i64
   i32.const 2147483647
   i32.and
   local.tee $5
   i32.const 1094263291
   i32.lt_u
   if
    local.get $5
    i32.const 20
    i32.shr_u
    local.tee $6
    local.get $0
    local.get $0
    f64.const 0.6366197723675814
    f64.mul
    f64.nearest
    local.tee $3
    f64.const 1.5707963267341256
    f64.mul
    f64.sub
    local.tee $0
    local.get $3
    f64.const 6.077100506506192e-11
    f64.mul
    local.tee $4
    f64.sub
    local.tee $1
    i64.reinterpret_f64
    i64.const 32
    i64.shr_u
    i32.wrap_i64
    i32.const 20
    i32.shr_u
    i32.const 2047
    i32.and
    i32.sub
    i32.const 16
    i32.gt_u
    if
     local.get $3
     f64.const 2.0222662487959506e-21
     f64.mul
     local.get $0
     local.get $0
     local.get $3
     f64.const 6.077100506303966e-11
     f64.mul
     local.tee $4
     f64.sub
     local.tee $0
     f64.sub
     local.get $4
     f64.sub
     f64.sub
     local.set $4
     local.get $6
     local.get $0
     local.get $4
     f64.sub
     local.tee $1
     i64.reinterpret_f64
     i64.const 32
     i64.shr_u
     i32.wrap_i64
     i32.const 20
     i32.shr_u
     i32.const 2047
     i32.and
     i32.sub
     i32.const 49
     i32.gt_u
     if
      local.get $3
      f64.const 8.4784276603689e-32
      f64.mul
      local.get $0
      local.get $0
      local.get $3
      f64.const 2.0222662487111665e-21
      f64.mul
      local.tee $4
      f64.sub
      local.tee $0
      f64.sub
      local.get $4
      f64.sub
      f64.sub
      local.set $4
      local.get $0
      local.get $4
      f64.sub
      local.set $1
     end
    end
    local.get $1
    global.set $~lib/math/rempio2_y0
    local.get $0
    local.get $1
    f64.sub
    local.get $4
    f64.sub
    global.set $~lib/math/rempio2_y1
    local.get $3
    i32.trunc_f64_s
    br $~lib/math/rempio2|inlined.0
   end
   i32.const 0
   local.get $2
   call $~lib/math/pio2_large_quot
   local.tee $5
   i32.sub
   local.get $5
   local.get $6
   select
  end
  local.set $6
  global.get $~lib/math/rempio2_y0
  local.set $3
  global.get $~lib/math/rempio2_y1
  local.set $4
  local.get $6
  i32.const 1
  i32.and
  if (result f64)
   local.get $3
   local.get $3
   f64.mul
   local.tee $0
   local.get $3
   f64.mul
   local.set $1
   local.get $3
   local.get $0
   f64.const 0.5
   local.get $4
   f64.mul
   local.get $1
   f64.const 0.00833333333332249
   local.get $0
   f64.const -1.984126982985795e-04
   local.get $0
   f64.const 2.7557313707070068e-06
   f64.mul
   f64.add
   f64.mul
   f64.add
   local.get $0
   local.get $0
   local.get $0
   f64.mul
   f64.mul
   f64.const -2.5050760253406863e-08
   local.get $0
   f64.const 1.58969099521155e-10
   f64.mul
   f64.add
   f64.mul
   f64.add
   f64.mul
   f64.sub
   f64.mul
   local.get $4
   f64.sub
   local.get $1
   f64.const -0.16666666666666632
   f64.mul
   f64.sub
   f64.sub
  else
   f64.const 1
   f64.const 0.5
   local.get $3
   local.get $3
   f64.mul
   local.tee $0
   f64.mul
   local.tee $1
   f64.sub
   local.tee $7
   f64.const 1
   local.get $7
   f64.sub
   local.get $1
   f64.sub
   local.get $0
   local.get $0
   f64.const 0.0416666666666666
   local.get $0
   f64.const -0.001388888888887411
   local.get $0
   f64.const 2.480158728947673e-05
   f64.mul
   f64.add
   f64.mul
   f64.add
   f64.mul
   local.get $0
   local.get $0
   f64.mul
   local.tee $1
   local.get $1
   f64.mul
   f64.const -2.7557314351390663e-07
   local.get $0
   f64.const 2.087572321298175e-09
   local.get $0
   f64.const -1.1359647557788195e-11
   f64.mul
   f64.add
   f64.mul
   f64.add
   f64.mul
   f64.add
   f64.mul
   local.get $3
   local.get $4
   f64.mul
   f64.sub
   f64.add
   f64.add
  end
  local.set $0
  local.get $6
  i32.const 1
  i32.add
  i32.const 2
  i32.and
  if
   local.get $0
   f64.neg
   local.set $0
  end
  local.get $0
 )
 (func $~lib/math/NativeMath.sin (param $0 f64) (result f64)
  (local $1 f64)
  (local $2 i64)
  (local $3 f64)
  (local $4 f64)
  (local $5 i32)
  (local $6 i32)
  (local $7 f64)
  local.get $0
  i64.reinterpret_f64
  local.tee $2
  i64.const 32
  i64.shr_u
  i32.wrap_i64
  local.tee $5
  i32.const 31
  i32.shr_u
  local.set $6
  local.get $5
  i32.const 2147483647
  i32.and
  local.tee $5
  i32.const 1072243195
  i32.le_u
  if
   local.get $5
   i32.const 1045430272
   i32.lt_u
   if
    local.get $0
    return
   end
   local.get $0
   local.get $0
   local.get $0
   f64.mul
   local.tee $3
   local.get $0
   f64.mul
   f64.const -0.16666666666666632
   local.get $3
   f64.const 0.00833333333332249
   local.get $3
   f64.const -1.984126982985795e-04
   local.get $3
   f64.const 2.7557313707070068e-06
   f64.mul
   f64.add
   f64.mul
   f64.add
   local.get $3
   local.get $3
   local.get $3
   f64.mul
   f64.mul
   f64.const -2.5050760253406863e-08
   local.get $3
   f64.const 1.58969099521155e-10
   f64.mul
   f64.add
   f64.mul
   f64.add
   f64.mul
   f64.add
   f64.mul
   f64.add
   return
  end
  local.get $5
  i32.const 2146435072
  i32.ge_u
  if
   local.get $0
   local.get $0
   f64.sub
   return
  end
  block $~lib/math/rempio2|inlined.1 (result i32)
   local.get $2
   i64.const 32
   i64.shr_u
   i32.wrap_i64
   i32.const 2147483647
   i32.and
   local.tee $5
   i32.const 1094263291
   i32.lt_u
   if
    local.get $5
    i32.const 20
    i32.shr_u
    local.tee $6
    local.get $0
    local.get $0
    f64.const 0.6366197723675814
    f64.mul
    f64.nearest
    local.tee $3
    f64.const 1.5707963267341256
    f64.mul
    f64.sub
    local.tee $0
    local.get $3
    f64.const 6.077100506506192e-11
    f64.mul
    local.tee $4
    f64.sub
    local.tee $1
    i64.reinterpret_f64
    i64.const 32
    i64.shr_u
    i32.wrap_i64
    i32.const 20
    i32.shr_u
    i32.const 2047
    i32.and
    i32.sub
    i32.const 16
    i32.gt_u
    if
     local.get $3
     f64.const 2.0222662487959506e-21
     f64.mul
     local.get $0
     local.get $0
     local.get $3
     f64.const 6.077100506303966e-11
     f64.mul
     local.tee $4
     f64.sub
     local.tee $0
     f64.sub
     local.get $4
     f64.sub
     f64.sub
     local.set $4
     local.get $6
     local.get $0
     local.get $4
     f64.sub
     local.tee $1
     i64.reinterpret_f64
     i64.const 32
     i64.shr_u
     i32.wrap_i64
     i32.const 20
     i32.shr_u
     i32.const 2047
     i32.and
     i32.sub
     i32.const 49
     i32.gt_u
     if
      local.get $3
      f64.const 8.4784276603689e-32
      f64.mul
      local.get $0
      local.get $0
      local.get $3
      f64.const 2.0222662487111665e-21
      f64.mul
      local.tee $4
      f64.sub
      local.tee $0
      f64.sub
      local.get $4
      f64.sub
      f64.sub
      local.set $4
      local.get $0
      local.get $4
      f64.sub
      local.set $1
     end
    end
    local.get $1
    global.set $~lib/math/rempio2_y0
    local.get $0
    local.get $1
    f64.sub
    local.get $4
    f64.sub
    global.set $~lib/math/rempio2_y1
    local.get $3
    i32.trunc_f64_s
    br $~lib/math/rempio2|inlined.1
   end
   i32.const 0
   local.get $2
   call $~lib/math/pio2_large_quot
   local.tee $5
   i32.sub
   local.get $5
   local.get $6
   select
  end
  local.set $6
  global.get $~lib/math/rempio2_y0
  local.set $3
  global.get $~lib/math/rempio2_y1
  local.set $4
  local.get $6
  i32.const 1
  i32.and
  if (result f64)
   f64.const 1
   f64.const 0.5
   local.get $3
   local.get $3
   f64.mul
   local.tee $0
   f64.mul
   local.tee $1
   f64.sub
   local.tee $7
   f64.const 1
   local.get $7
   f64.sub
   local.get $1
   f64.sub
   local.get $0
   local.get $0
   f64.const 0.0416666666666666
   local.get $0
   f64.const -0.001388888888887411
   local.get $0
   f64.const 2.480158728947673e-05
   f64.mul
   f64.add
   f64.mul
   f64.add
   f64.mul
   local.get $0
   local.get $0
   f64.mul
   local.tee $1
   local.get $1
   f64.mul
   f64.const -2.7557314351390663e-07
   local.get $0
   f64.const 2.087572321298175e-09
   local.get $0
   f64.const -1.1359647557788195e-11
   f64.mul
   f64.add
   f64.mul
   f64.add
   f64.mul
   f64.add
   f64.mul
   local.get $3
   local.get $4
   f64.mul
   f64.sub
   f64.add
   f64.add
  else
   local.get $3
   local.get $3
   f64.mul
   local.tee $0
   local.get $3
   f64.mul
   local.set $1
   local.get $3
   local.get $0
   f64.const 0.5
   local.get $4
   f64.mul
   local.get $1
   f64.const 0.00833333333332249
   local.get $0
   f64.const -1.984126982985795e-04
   local.get $0
   f64.const 2.7557313707070068e-06
   f64.mul
   f64.add
   f64.mul
   f64.add
   local.get $0
   local.get $0
   local.get $0
   f64.mul
   f64.mul
   f64.const -2.5050760253406863e-08
   local.get $0
   f64.const 1.58969099521155e-10
   f64.mul
   f64.add
   f64.mul
   f64.add
   f64.mul
   f64.sub
   f64.mul
   local.get $4
   f64.sub
   local.get $1
   f64.const -0.16666666666666632
   f64.mul
   f64.sub
   f64.sub
  end
  local.set $0
  local.get $6
  i32.const 2
  i32.and
  if
   local.get $0
   f64.neg
   local.set $0
  end
  local.get $0
 )
 (func $assembly/index/setNrectangle (param $0 i32) (param $1 i32) (param $2 f32) (param $3 f32) (param $4 f32) (param $5 f32)
  (local $6 i32)
  (local $7 i32)
  (local $8 f32)
  (local $9 f32)
  (local $10 f32)
  local.get $4
  f64.promote_f32
  f64.const 3.141592653589793
  f64.mul
  f64.const 180
  f64.div
  call $~lib/math/NativeMath.cos
  f32.demote_f64
  local.set $9
  local.get $4
  f64.promote_f32
  f64.const 3.141592653589793
  f64.mul
  f64.const 180
  f64.div
  call $~lib/math/NativeMath.sin
  f32.demote_f64
  local.set $10
  loop $for-loop|0
   local.get $7
   global.get $assembly/index/RIPPLE_IMAGE_PIXEL_WIDTH
   i32.lt_s
   if
    i32.const 0
    local.set $6
    loop $for-loop|1
     local.get $6
     global.get $assembly/index/RIPPLE_IMAGE_PIXEL_HEIGHT
     i32.lt_s
     if
      local.get $5
      f32.const 1
      f32.sub
      local.set $4
      local.get $7
      local.get $0
      i32.sub
      f32.convert_i32_s
      local.get $9
      f32.mul
      local.get $6
      local.get $1
      i32.sub
      f32.convert_i32_s
      local.get $10
      f32.mul
      f32.add
      f32.const 0.5
      local.get $2
      f32.mul
      f32.sub
      f32.abs
      local.tee $8
      local.get $2
      f32.const 0.5
      f32.mul
      f32.const 1
      f32.add
      f32.gt
      if (result f32)
       f32.const 0
      else
       local.get $4
       f32.const 1
       local.get $8
       f32.sub
       local.get $2
       f32.const 0.5
       f32.mul
       f32.add
       f32.mul
       local.get $4
       local.get $8
       local.get $2
       f32.const 0.5
       f32.mul
       f32.gt
       select
      end
      local.set $4
      local.get $7
      local.get $6
      local.get $7
      local.get $6
      call $assembly/index/getNSquared
      local.get $7
      local.get $0
      i32.sub
      f32.convert_i32_s
      local.get $10
      f32.mul
      local.get $6
      local.get $1
      i32.sub
      f32.convert_i32_s
      local.get $9
      f32.mul
      f32.sub
      f32.const 0.5
      local.get $3
      f32.mul
      f32.add
      f32.abs
      local.tee $8
      local.get $3
      f32.const 0.5
      f32.mul
      f32.const 1
      f32.add
      f32.gt
      if (result f32)
       f32.const 0
      else
       local.get $4
       f32.const 1
       local.get $8
       f32.sub
       local.get $3
       f32.const 0.5
       f32.mul
       f32.add
       f32.mul
       local.get $4
       local.get $8
       local.get $3
       f32.const 0.5
       f32.mul
       f32.gt
       select
      end
      f32.const 1
      f32.add
      f32.mul
      call $assembly/index/setNSquared
      local.get $6
      i32.const 1
      i32.add
      local.set $6
      br $for-loop|1
     end
    end
    local.get $7
    i32.const 1
    i32.add
    local.set $7
    br $for-loop|0
   end
  end
 )
 (func $assembly/index/setLineOscillator (param $0 i32)
  (local $1 i32)
  loop $for-loop|0
   local.get $1
   global.get $assembly/index/RIPPLE_IMAGE_PIXEL_HEIGHT
   i32.const 1
   i32.sub
   i32.lt_s
   if
    local.get $0
    local.get $1
    i32.const 5
    call $assembly/index/setAbsorberType
    local.get $1
    i32.const 1
    i32.add
    local.set $1
    br $for-loop|0
   end
  end
 )
 (func $assembly/index/setPointOscillator (param $0 i32) (param $1 i32)
  local.get $0
  local.get $1
  i32.const 5
  call $assembly/index/setAbsorberType
 )
 (func $assembly/index/resetAbsorbers
  (local $0 i32)
  (local $1 i32)
  i32.const 1
  local.set $0
  loop $for-loop|0
   local.get $0
   global.get $assembly/index/RIPPLE_IMAGE_PIXEL_HEIGHT
   i32.const 1
   i32.sub
   i32.lt_s
   if
    i32.const 1
    local.set $1
    loop $for-loop|1
     local.get $1
     global.get $assembly/index/RIPPLE_IMAGE_PIXEL_WIDTH
     i32.const 1
     i32.sub
     i32.lt_s
     if
      local.get $1
      local.get $0
      i32.const 0
      call $assembly/index/setAbsorberType
      local.get $1
      i32.const 1
      i32.add
      local.set $1
      br $for-loop|1
     end
    end
    local.get $0
    i32.const 1
    i32.add
    local.set $0
    br $for-loop|0
   end
  end
 )
 (func $assembly/index/resetNSquared
  (local $0 i32)
  (local $1 i32)
  i32.const 1
  local.set $0
  loop $for-loop|0
   local.get $0
   global.get $assembly/index/RIPPLE_IMAGE_PIXEL_HEIGHT
   i32.const 1
   i32.sub
   i32.lt_s
   if
    i32.const 1
    local.set $1
    loop $for-loop|1
     local.get $1
     global.get $assembly/index/RIPPLE_IMAGE_PIXEL_WIDTH
     i32.const 1
     i32.sub
     i32.lt_s
     if
      local.get $1
      local.get $0
      f32.const 1
      call $assembly/index/setNSquared
      local.get $1
      i32.const 1
      i32.add
      local.set $1
      br $for-loop|1
     end
    end
    local.get $0
    i32.const 1
    i32.add
    local.set $0
    br $for-loop|0
   end
  end
 )
 (func $assembly/index/setFrequency (param $0 f32)
  local.get $0
  global.set $assembly/index/FREQUENCY
  f32.const 39.478355407714844
  global.get $assembly/index/FREQUENCY
  f32.mul
  global.get $assembly/index/FREQUENCY
  f32.mul
  global.get $assembly/index/FRAMES_PER_SECOND
  f32.convert_i32_s
  f32.div
  global.get $assembly/index/FRAMES_PER_SECOND
  f32.convert_i32_s
  f32.div
  f32.const 10
  f32.div
  f32.const 10
  f32.div
  global.set $assembly/index/OMEGA2
 )
 (func $assembly/index/setSpeed (param $0 f32)
  local.get $0
  global.set $assembly/index/SPEED
  local.get $0
  local.get $0
  f32.mul
  global.set $assembly/index/SPEED_SQUARED
 )
 (func $assembly/index/setFriction (param $0 f32)
  local.get $0
  global.set $assembly/index/FRICTION
 )
 (func $assembly/index/setHardBoundary (param $0 i32)
  local.get $0
  global.set $assembly/index/HARD_BOUNDARY
 )
 (func $assembly/index/setHighContrast (param $0 i32)
  local.get $0
  i32.const 0
  i32.ne
  global.set $assembly/index/HIGH_CONTRAST
 )
 (func $assembly/index/setMaxAmplitude (param $0 f32)
  local.get $0
  global.set $assembly/index/MAX_AMPLITUDE
 )
 (func $assembly/index/setColour (param $0 i32)
  local.get $0
  i32.const 24
  i32.shl
  i32.const 24
  i32.shr_s
  global.set $assembly/index/COLOUR
  call $assembly/index/setBlack
 )
 (func $~start
  global.get $assembly/index/RIPPLE_IMAGE_PIXEL_WIDTH
  global.get $assembly/index/RIPPLE_IMAGE_PIXEL_HEIGHT
  i32.mul
  global.set $assembly/index/RIPPLE_IMAGE_NUM_PIXELS
  f32.const 39.478355407714844
  global.get $assembly/index/FREQUENCY
  f32.mul
  global.get $assembly/index/FREQUENCY
  f32.mul
  global.get $assembly/index/FRAMES_PER_SECOND
  f32.convert_i32_s
  f32.div
  global.get $assembly/index/FRAMES_PER_SECOND
  f32.convert_i32_s
  f32.div
  f32.const 10
  f32.div
  f32.const 10
  f32.div
  global.set $assembly/index/OMEGA2
  global.get $assembly/index/SPEED
  global.get $assembly/index/SPEED
  f32.mul
  global.set $assembly/index/SPEED_SQUARED
 )
 (func $~lib/rt/pure/__collect
  nop
 )
 (func $~lib/rt/pure/decrement (param $0 i32)
  (local $1 i32)
  (local $2 i32)
  local.get $0
  i32.load offset=4
  local.tee $2
  i32.const 268435455
  i32.and
  local.set $1
  local.get $0
  i32.load
  i32.const 1
  i32.and
  if
   i32.const 0
   i32.const 1152
   i32.const 122
   i32.const 14
   call $~lib/builtins/abort
   unreachable
  end
  local.get $1
  i32.const 1
  i32.eq
  if
   block $__inlined_func$~lib/rt/__visit_members
    block $switch$1$default
     block $switch$1$case$4
      local.get $0
      i32.const 8
      i32.add
      i32.load
      br_table $__inlined_func$~lib/rt/__visit_members $__inlined_func$~lib/rt/__visit_members $switch$1$case$4 $switch$1$default
     end
     local.get $0
     i32.load offset=16
     local.tee $1
     if
      local.get $1
      i32.const 1404
      i32.ge_u
      if
       local.get $1
       i32.const 16
       i32.sub
       call $~lib/rt/pure/decrement
      end
     end
     br $__inlined_func$~lib/rt/__visit_members
    end
    unreachable
   end
   local.get $2
   i32.const -2147483648
   i32.and
   if
    i32.const 0
    i32.const 1152
    i32.const 126
    i32.const 18
    call $~lib/builtins/abort
    unreachable
   end
   local.get $0
   local.get $0
   i32.load
   i32.const 1
   i32.or
   i32.store
   global.get $~lib/rt/tlsf/ROOT
   local.get $0
   call $~lib/rt/tlsf/insertBlock
  else
   local.get $1
   i32.const 0
   i32.le_u
   if
    i32.const 0
    i32.const 1152
    i32.const 136
    i32.const 16
    call $~lib/builtins/abort
    unreachable
   end
   local.get $0
   local.get $1
   i32.const 1
   i32.sub
   local.get $2
   i32.const -268435456
   i32.and
   i32.or
   i32.store offset=4
  end
 )
)
