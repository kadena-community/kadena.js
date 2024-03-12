import Docker from 'dockerode';
import { statSync } from 'node:fs';
import { logger } from './logger';

export function isDockerInstalled() {
  const socket = process.env.DOCKER_SOCKET || '/var/run/docker.sock';
  try {
    const stats = statSync(socket);
    return stats.isSocket();
  } catch (e) {
    return false;
  }
}

export interface DockerContainerConfig {
  name?: string;
  image: string;
  tag?: string;
  port?: number | string;
  volume?: string;
}

export type DockerContainer = Docker.Container;
export const DOCKER_SOCKET =
  process.env.DOCKER_SOCKET || '/var/run/docker.sock';

export class DockerService {
  private docker: Docker;
  constructor(private socket = DOCKER_SOCKET) {
    this.docker = new Docker({
      socketPath: this.socket,
    });
  }

  async pullImage(image: string, onProgress: (event: any) => void) {
    try {
      const stream = await this.docker.pull(image);
      return new Promise((resolve, reject) => {
        this.docker.modem.followProgress(
          stream,
          (error, results) => {
            if (error) {
              reject(error);
            } else {
              resolve(results);
            }
          },
          onProgress,
        );
      });
    } catch (e) {
      return Promise.reject(e);
    }
  }

  async pullImageIfNotExists(image: string) {
    // Check if the image exists
    try {
      await this.docker.getImage(image).inspect();
    } catch (e) {
      logger.log(`Image ${image} does not exist, pulling...`);
      // Pull the image
      await this.pullImage(image, (event) => {
        logger.info(`${event.status} ${event.progressDetail || ''}`);
      });
    }
  }

  async createVolumeIfNotExists(volume: string) {
    // Check if the volume exists
    try {
      this.docker.getVolume(volume);
    } catch (e) {
      logger.log(`Volume ${volume} does not exist, creating...`);
      await this.docker.createVolume({
        Name: volume,
      });
    }
  }

  async removeContainerIfExists(search: string) {
    // Remove the container if it exists
    try {
      const containers = await this.docker.listContainers();
      const containerInfo = containers.find((c) => {
        if (c.Names.includes(`/${search}`) || c.Names.includes(search)) {
          return true;
        }
        if (c.Image.includes(search)) {
          return true;
        }
        if (c.Id.includes(search)) {
          return true;
        }
      });
      if (containerInfo) {
        const container = this.docker.getContainer(containerInfo.Id);
        if (containerInfo.State === 'running') {
          logger.log(`Container ${search} is running, killing...`);
          await container.kill({
            signal: 'SIGKILL',
          });
        }
        logger.log(`Container ${search} exists, removing...`);
        await container.remove({
          force: true,
        });
      }
    } catch (e) {
      throw new Error(`Failed to remove container ${search}, ${e}`);
    }
  }

  async createContainer(config: DockerContainerConfig) {
    // Create the container
    const imageName = `${config.image}:${config.tag}`;
    return this.docker.createContainer({
      Image: imageName,
      name: config.name,
      ExposedPorts: { '8080/tcp': {} },
      HostConfig: {
        Binds: config.volume ? [`${config.volume}:/data`] : [],
        PortBindings: {
          '8080/tcp': [
            { HostPort: `${config.port || 8080}`, HostIp: '127.0.0.1' },
          ],
        },
        PublishAllPorts: true,
        AutoRemove: true,
      },
    });
  }

  async startContainer(container: DockerContainer, attach = false) {
    // Start the container
    await container.start();
    if (attach) {
      container.attach(
        { stream: true, stdout: true, stderr: true },
        (err, stream) => {
          if (err) {
            logger.error(`Error attaching to container ${container.id}`);
            return;
          }
          stream?.on('data', (chunk) => {
            logger.log(chunk.toString());
          });
        },
      );
    }
  }
}
