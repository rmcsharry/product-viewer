import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  Color,
  Object3D,
  AmbientLight,
  Box3,
  Vector3,
  Camera,
  Object3DEventMap,
  Group,
  PMREMGenerator,
  DirectionalLight,
} from 'three';
import { GLTF } from 'three/examples/jsm/Addons.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

const DEFAULT_CAMERA = '[default]';

type SceneState = {
  actionStates: Object,
  ambientColor: string,
  ambientIntensity: number,
  autoRotate: boolean,
  background: boolean,
  bgColor: string,
  camera: string | PerspectiveCamera,
  directColor: string,
  directIntensity: number,
  playbackSpeed: number,
  punctualLights: boolean,
}

export class SceneSetup {
  animate: any;
  scene: Scene;
  activeCamera: PerspectiveCamera;
  defaultCamera: PerspectiveCamera;
  lights: (AmbientLight | DirectionalLight)[];
  renderer: WebGLRenderer;
  controls: OrbitControls;
  content: Object3D;
  state: SceneState;
  pmremGenerator: PMREMGenerator;
  onZoomChange?: (zoom: number) => void;

  constructor(container: HTMLElement) {
    this.state = {
      actionStates: {},
      ambientColor: '#FFFFFF',
      ambientIntensity: 0.3,
      autoRotate: true,
      background: false,
      bgColor: '#FFFFFF',
      camera: DEFAULT_CAMERA,
      directColor: '#FFFFFF',
      directIntensity:  4,
      playbackSpeed: 1.0,
      punctualLights: true,
    };

    this.lights = [];
    this.content = {} as Object3D;

    // setup cameras
    const fov = (0.8 * 180) / Math.PI; // TODO: might need work
    const aspectRatio = container.clientWidth / container.clientHeight;
    this.defaultCamera = new PerspectiveCamera(fov, aspectRatio, 0.01, 1000);
    this.activeCamera = this.defaultCamera;

    // setup scene
    this.scene = new Scene();
    this.scene.add(this.defaultCamera);
    this.scene.background = new Color(this.state.bgColor);

    // setup renderer
    this.renderer = new WebGLRenderer({ antialias: true });
	  this.renderer.setClearColor(0xcccccc);
		this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(container.clientWidth, container.clientHeight);

    this.pmremGenerator = new PMREMGenerator(this.renderer);
		this.pmremGenerator.compileEquirectangularShader();

    
    this.controls = new OrbitControls(this.defaultCamera, this.renderer.domElement);
    this.controls.screenSpacePanning = true;
    
    container.appendChild(this.renderer.domElement);

    // this.activeCamera.position.set(5,0,10);
    // this.activeCamera.lookAt(0,0,0);

    // const hlp = new AxesHelper(1);
    // this.scene.add(hlp);
    
    // this.controls = new OrbitControls(this.activeCamera, this.renderer.domElement);
    // this.controls.enableDamping = true;
    // this.controls.addEventListener('change', () => {
    //   if (this.onZoomChange) {
    //     this.onZoomChange(this.activeCamera.position.z);
    //   }
    // });
    

    this.setupLights();
    this.loadModel();

    // this.animate = this.animate.bind(this);
		// requestAnimationFrame(this.animate);
  }

  private setupLights() {
    // const pointLight = new PointLight(0xffffff, 1, 100);
    // pointLight.position.set(0, 0, 0);
    // this.scene.add(pointLight);
    
    // const ambientLight = new AmbientLight(0x404040);
    // this.scene.add(ambientLight);

		const state = this.state;

		const light1 = new AmbientLight(state.ambientColor, state.ambientIntensity);
		light1.name = 'ambient_light';
		this.defaultCamera.add(light1);

		const light2 = new DirectionalLight(state.directColor, state.directIntensity);
		light2.position.set(0.5, 0, 0.866); // ~60º
		light2.name = 'main_light';
		this.defaultCamera.add(light2);

		this.lights.push(light1, light2);
  }

  private loadModel() {
    const loader: GLTFLoader = new GLTFLoader();
    
    // Create a simple sphere as a placeholder
    // const sphereGeometry = new THREE.SphereGeometry(1, 32, 32);
    // const material = new THREE.MeshPhongMaterial({ 
    //   color: 0xffffff,
    //   shininess: 100
    // });
    // this.model = new THREE.Mesh(sphereGeometry, material);
    // this.scene.add(this.model);

    loader.load(
      '/models/Mod_Total_Look.glb',
      (gltf: GLTF) => {
        // this.scene.remove(this.model!);
        const group = gltf.scene;
        // const clips = gltf.animations || [];
        this.setContent(group);

        // this.model = gltf.scene;
        // this.scene.add(gltf.scene);
      },
      (xhr: any) => {
        console.log((xhr.loaded / xhr.total * 100) + '% loaded');
      },
      (error: unknown) => {
        console.error('Error loading model:', error);
      }
    );
  }

  private setContent(object: Group<Object3DEventMap>) {
		const box = new Box3().setFromObject(object);
		const size = box.getSize(new Vector3()).length();
		const center = box.getCenter(new Vector3());

		// this.controls.reset();

		object.position.x -= center.x;
		object.position.y -= center.y;
		object.position.z -= center.z;

		this.controls.maxDistance = size * 10;

		this.defaultCamera.near = size / 100;
		this.defaultCamera.far = size * 100;
    this.defaultCamera.updateProjectionMatrix();

    this.defaultCamera.position.copy(center);
		this.defaultCamera.position.x += size / 2.0;
		this.defaultCamera.position.y += size / 5.0;
		this.defaultCamera.position.z += size / 2.0;
    this.defaultCamera.lookAt(center);

    this.setCamera(DEFAULT_CAMERA);

    // this.axesCamera.position.copy(this.defaultCamera.position);
		// this.axesCamera.lookAt(this.axesScene.position);
		// this.axesCamera.near = size / 100;
		// this.axesCamera.far = size * 100;
		// this.axesCamera.updateProjectionMatrix();
		// this.axesCorner.scale.set(size, size, size);

    // this.controls.saveState();

    this.scene.add(object);
    this.content = object;

    this.state.punctualLights = true;
    
  }

	setCamera(name: string) {
		if (name === DEFAULT_CAMERA) {
			this.controls.enabled = true;
			this.activeCamera = this.defaultCamera;
		} else {
			this.controls.enabled = false;
    this.content?.traverse((node) => {
      if (node instanceof Camera && node.name === name) {
        this.activeCamera = node as PerspectiveCamera;
      }
    });
		}
	}

  updateZoom(zoom: number) {
    this.activeCamera.position.z = zoom;
    this.activeCamera.updateProjectionMatrix();
  }

  updateRotation(rotation: { x: number; y: number }) {
    if (this.content) {
      this.content.rotation.x = rotation.x;
      this.content.rotation.y = rotation.y;
    }
  }

  resize(width: number, height: number) {
    this.activeCamera.aspect = width / height;
    this.activeCamera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  render() {
    this.controls.update();
    this.renderer.render(this.scene, this.activeCamera);
  }

  dispose() {
    this.renderer.dispose();
    this.controls.dispose();
  }
}